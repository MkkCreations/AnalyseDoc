import trp.trp2 as t2
import time
import boto3
from pdf2image import convert_from_path
from PyPDF2 import PdfWriter, PdfReader

tempo = time.time()

wolfberg = [
    {"Text": "What is the full legal name ?", "Alias": "FULL_LEGAL_NAME", "Pages": ['1']},
    {"Text": "Does the firm cover AML and CTF ?", "Alias": "AML_CTF", "Pages": ['2']},
    {"Text": "Shareholder owning 25 percent or more ? ", "Alias": "SHAREHOLDER", "Pages": ['1']},
    {"Text": "Are sub-distributors regulated for distribution of investment funds and are regulated for the purposes of AML ?","Alias": "SUBDISTRIBUTORS_AML", "Pages": ['2']},
    {"Text": "Does the firm require sub distributors to certify that they meet regulatory requirements for AML or KYC compliance", "Alias": "COMPLIANCE_FUNCTION", "Pages": ['2', '5']},
    {"Text": "Internal Risk management function", "Alias": "RISK_MANAGEMENT", "Pages": ['*']},
    {"Text": "What is the registred address", "Alias": "REGISTRED_ADDRESS", "Pages": ['1']},
    {"Text": "What is the country of incorporation", "Alias": "COUNTRY_OF_INCORPORATION", "Pages": ['1']},
]

esma = [
    {"Text": "Is the entity regulated ?", "Alias": "REGULATED_ENTITY", "Pages": ['1']},
    {"Text": "What are the services name of the current activities ?", "Alias": "SERVICES_NAME", "Pages": ['1']},
]

sirene = [
    {"Text": "What is the main exerced activity ?", "Alias": "TYPE_OF_BUSINESS"},
]

mifid2 = [
    {"Text": "Does the firm has an internal process for the review and approval of new fund products to be distributed?", "Alias": "REVIEW_APPROVAL"},
    {"Text": "Does the entity distribute or make available investment funds in any jurisdiction other than your domiciled country?", "Alias": "DISTRIBUTE_INVESTMENT"},
    {"Text": "Does the entity distribute or market investment funds in accordance with the applicable rules and regulations ?", "Alias": "DISTRIBUTE_MARKET"},
    {"Text": "Where required by law, does the entity disclose to investors any inducements your firm receives from fund manufacturers and all fees  collected for distribution or placement activities?", "Alias": "DISCLOSE_INVESTORS"},
     {"Text": "Does the entity reasonably apply a suitability test or other applicable standard of care to determine that investment funds offered to customers meet their needs?", "Alias": "SUITABILITY_TEST"},
    {"Text": "Does the entity provide regular reporting or MiFID target market confirmations to the investment fund manufacturer or sponsor?", "Alias": "REGULAR_REPORTING"}
]

corporation = [
    {"Text": "What is the name of the director and chief exectuive officer ?", "Alias": "DIRECTOR_NAME", "Pages": ['1']},
]

chiffre_cles = [
    {"Text": "Produit net bancaire ? ", "Alias": "LEVEL_ASSETS", "Pages": ['1']},
]
res = []


def uploadS3(s3BucketName, documentName, diligenceId, documentType):
    print(documentName)
    s3 = boto3.client("s3")
    s3.upload_file(
        Filename=documentName,
        Bucket=s3BucketName,
        Key=str(diligenceId + '/' + documentType + '/' + documentName),
    )


def outputQueries(s3BucketName, documentName, diligenceId, documentType):
    data = get_kv_map(s3BucketName, documentName, diligenceId, documentType)
    d = t2.TDocumentSchema().load(data)
    for i in range(len(d.pages)):
        try:
            print(f"--------- Page {i} ---------")
            page = d.pages[i]
            query_answers = d.get_query_answers(page=page)
            for x in query_answers:
                if x[2] and res.count(f"{x[1]},{x[2]}") == 0:
                    res.append(f"{x[1]},{x[2]}")
        except:
            print("No queries found")


''' def split_pdf(file, s3BucketName, documentType, diligenceId):
    inputpdf = PdfReader(open(file, "rb"))
    for i in range(len(inputpdf.pages)):
        output = PdfWriter()
        output.add_page(inputpdf.pages[i])
        with open(f"{i}.pdf", "wb") as outputStream:
            output.write(outputStream)
        uploadS3(s3BucketName, f"{i}.pdf", diligenceId, documentType)
        outputQueries(s3BucketName, f"{i}.pdf", diligenceId, documentType) '''
        
        
def get_kv_map(s3BucketName, documentName, diligenceId, documentType):
    client = boto3.client("textract")
    response = client.start_document_analysis(
        DocumentLocation={"S3Object": {"Bucket": s3BucketName, "Name":  str(diligenceId +'/' + documentType + '/' + documentName)}},
        FeatureTypes=["QUERIES"],
        QueriesConfig={
            "Queries": corporation,
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

def __init__():
    s3BucketName = "s3analysedoc"
    documentName = "BNP-CHIFFRES-CLES.png"
    documentType = "CHIFFRES-CLES"
    diligenceId = '1'


    uploadS3(s3BucketName, documentName, diligenceId, documentType)
    outputQueries(s3BucketName, documentName, diligenceId, documentType)
    print(res)
    tempo2 = time.time()
    print(tempo2 - tempo)

if __name__ == "__main__":
    __init__()
    
