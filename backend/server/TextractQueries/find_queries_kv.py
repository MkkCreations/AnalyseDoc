import trp.trp2 as t2
import time
import boto3
import os
import split_and_merge_pdf as splitter

tempo = time.time()

page_to_keep_wolfsberg = [1, 2, 5]
page_to_keep_esma = [1]

wolfsberg = [
    {
        "Text": "What is the full legal name ?",
        "Alias": "1.1",
        "Pages": ["1"],
    },
    {"Text": "Does the firm cover AML and CTF ?", "Alias": "1.4c", "Pages": ["2"]},
    {
        "Text": "Shareholder owning 25 percent or more ? ",
        "Alias": "1.7",
        "Pages": ["1"],
    },
    {
        "Text": "Are sub-distributors regulated for distribution of investment funds and are regulated for the purposes of AML ?",
        "Alias": "4.3",
        "Pages": ["2"],
    },
    {
        "Text": "Does the firm require sub distributors to certify that they meet regulatory requirements for AML or KYC compliance",
        "Alias": "4.7",
        "Pages": ["3"],
    },
    {
        "Text": "Internal Risk management function",
        "Alias": "6.1",
        "Pages": ["*"],
    },
    {
        "Text": "What is the registred address",
        "Alias": "1.2",
        "Pages": ["1"],
    },
    {
        "Text": "What is the country of incorporation",
        "Alias": "1.3",
        "Pages": ["1"],
    },
]

esma = [
    {"Text": "Does the entity type manage money, yes or no ?", "Alias": "1.4", "Pages": ["1"]},
    {
        "Text": "What are the services name of the current activities ?",
        "Alias": "2.4",
        "Pages": ["1"],
    },
]

sirene = [
    {"Text": "What is the main exerced activity ?", "Alias": "2.3"},
]

mifid2 = [
    {
        "Text": "Does the firm has an internal process for the review and approval of new fund products to be distributed?",
        "Alias": "REVIEW_APPROVAL",
    },
    {
        "Text": "Does the entity distribute or make available investment funds in any jurisdiction other than your domiciled country?",
        "Alias": "DISTRIBUTE_INVESTMENT",
    },
    {
        "Text": "Does the entity distribute or market investment funds in accordance with the applicable rules and regulations ?",
        "Alias": "DISTRIBUTE_MARKET",
    },
    {
        "Text": "Where required by law, does the entity disclose to investors any inducements your firm receives from fund manufacturers and all fees  collected for distribution or placement activities?",
        "Alias": "DISCLOSE_INVESTORS",
    },
    {
        "Text": "Does the entity reasonably apply a suitability test or other applicable standard of care to determine that investment funds offered to customers meet their needs?",
        "Alias": "SUITABILITY_TEST",
    },
    {
        "Text": "Does the entity provide regular reporting or MiFID target market confirmations to the investment fund manufacturer or sponsor?",
        "Alias": "REGULAR_REPORTING",
    },
]

corporation = [
    {
        "Text": "What is the name of the director and chief exectuive officer ?",
        "Alias": "1.8",
        "Pages": ["1"],
    },
]

chiffre_cles = [
    {"Text": "Produit net bancaire ? ", "Alias": "2.1", "Pages": ["1"]},
]

def split_factory(input_path, dilligence_id, document_type):
    if document_type.lower() == "wolfsberg":
        splitter.pdf_splitter(input_path, page_to_keep_wolfsberg, dilligence_id)
        return True
    elif document_type.lower() == "esma":
        splitter.pdf_splitter(input_path, page_to_keep_esma, dilligence_id)
        return True
    return False


def upload_to_s3(s3BucketName, documentName, diligenceId, documentType):
    docName = documentName.split("/")[-1]
    s3 = boto3.client("s3")
    s3.upload_file(
        Filename=documentName,
        Bucket=s3BucketName,
        Key="{diligenceId}/{documentType}/{docName}".format(
            diligenceId=diligenceId, documentType=documentType, docName=docName
        ),
    )





def get_result_and_confidence(
    s3BucketName, documentName, diligenceId, documentType, res
):
    data = get_kv_map(s3BucketName, documentName, diligenceId, documentType)
    confidence_list = get_confidence_score(data)
    d = t2.TDocumentSchema().load(data)
    no_ici_exists = False
    # print("confidence", confidence)
    for i in range(len(d.pages)):
        try:
            print(f"--------- Page {i} ---------")
            page = d.pages[i]
            query_answers = d.get_query_answers(page=page)
            for x in query_answers:
                if x[2] and res.count(f"{x[1]},{x[2]}") == 0:
                    query_object = format_queries_as_dict(
                        x[1], x[2], confidence_list[i], documentType.lower()
                    )
                    for object in res:
                        if object["no_ici"] == x[1]:
                            object["answer"] = f'{object["answer"]}, {x[2]}'
                            no_ici_exists = True
                    if not no_ici_exists:
                        res.append(query_object)
                        no_ici_exists = False                
        except:
            continue


def get_confidence_score(query_response):
    confidence_list = []
    query_result = query_response["Blocks"]
    for block in query_result:
        if block["BlockType"] == "QUERY_RESULT":
            confidence_list.append(block["Confidence"])
    return confidence_list

def format_queries_as_dict(question_number, answer, confidence_score):
    return {
        "no_ici": question_number,
        "answer": answer,
        "confidence_score": confidence_score,
        "document_type": "wolfsberg",
    }

def get_kv_map(s3BucketName, documentName, diligenceId, documentType):
    client = boto3.client("textract")
    docName = documentName.split("/")[-1]
    queryType = None
    document_type = documentType.lower()

    if document_type == "wolfsberg":
        queryType = wolfsberg
    elif document_type == "esma":
        queryType = esma
    elif document_type == "sirene":
        queryType = sirene
    elif document_type == "mifid2":
        queryType = mifid2

    response = client.start_document_analysis(
        DocumentLocation={
            "S3Object": {
                "Bucket": s3BucketName,
                "Name": f"{diligenceId}/{documentType}/{docName}",
            }
        },
        FeatureTypes=["QUERIES"],
        QueriesConfig={
            "Queries": queryType,
        },
    )

    job_id = response["JobId"]
    response = client.get_document_analysis(JobId=job_id)
    status = response["JobStatus"]

    while status == "IN_PROGRESS":
        time.sleep(5)
        response = client.get_document_analysis(JobId=job_id)
        status = response["JobStatus"]
        print("Job status: {}".format(status))

    return response


# <<<<==================>>> Main <<<==================>>>>


def find_by_queries(path, document_type, dilligence_id):
    s3_bucket_name = "inputanalyze"
    document_path = os.path.realpath(".") + "{path}".format(path=path)
    directory_path = f'{os.path.realpath(".")}/media/documents/{dilligence_id}'
    merged_document_name = f'merged_{document_path.split("/")[-1]}'
    normal_document_name = document_path.split("/")[-1]
    merged_document_path = f'{directory_path}/{merged_document_name}'
    res = []


    split_made = split_factory(document_path, dilligence_id, document_type)
    if split_made:
        upload_to_s3(s3_bucket_name, merged_document_path, dilligence_id, document_type)
        get_result_and_confidence(
        s3_bucket_name, merged_document_path, dilligence_id, document_type, res
        )
    else: 
        upload_to_s3(s3_bucket_name, document_path, dilligence_id, document_type)
        get_result_and_confidence(
        s3_bucket_name, document_path, dilligence_id, document_type, res
        )
    tempo2 = time.time()    
    return res

if __name__ == "__main__":
    find_by_queries(
        path="/media/documents/1/SIRENE-BNP.pdf",
        document_type="sirene",
        dilligence_id="1",
    )