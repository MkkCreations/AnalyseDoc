import os
import json
from pypdf import PdfReader, PdfWriter
import trp.trp2 as t2
from textractcaller.t_call import call_textract, Textract_Features, Textract_Types
from textractprettyprinter.t_pretty_print import (
    Textract_Pretty_Print,
    get_string,
    get_tables_string,
    Pretty_Print_Table_Format,
)
from trp.trp2 import TDocument, TDocumentSchema
from trp.t_tables import MergeOptions, HeaderFooterType
import boto3
import pandas as pd
from trp import Document
import re
import split_and_merge_pdf as splitter

textract_client = boto3.client("textract")

page_to_keep_wolfsberg = [2, 4, 5, 8, 11]

wolfsberg_to_ici_data = [
        {"wolfsberg": "19", "ici": "4.7"},
        {"wolfsberg": "9i", "ici": "4.5"},
        {"wolfsberg": "34b", "ici": "4.6"},
        {"wolfsberg": "9n", "ici": "5.2"},
        {"wolfsberg": "41", "ici": "5.3"},
        {"wolfsberg": "18", "ici": "6.4"},
        {"wolfsberg": "9n", "ici": "6.7"},
        {"wolfsberg": "16i", "ici": "6.8"},
        {"wolfsberg": "10", "ici": "6.11"},
    ]

def upload_to_s3(s3_bucket_name, document_to_upload, bucket_path):
    s3 = boto3.client("s3")
    s3.upload_file(
        Filename=document_to_upload,
        Bucket=s3_bucket_name,
        Key= bucket_path,
    )

def get_kv_map(s3_bucket_name, documentName, diligenceId, documentType):
    client = boto3.client("textract")
    docName = documentName.split("/")[-1]
    print("doc name", docName)
    response = client.start_document_analysis(
        DocumentLocation={
            "S3Object": {
                "Bucket": s3_bucket_name,
                "Name": str(diligenceId + "/" + documentType + "/" + docName),
            }
        },
        FeatureTypes=["TABLES"],
    )
    job_id = response["JobId"]
    response = client.get_document_analysis(JobId=job_id)
    status = response["JobStatus"]
    while status == "IN_PROGRESS":
        response = client.get_document_analysis(JobId=job_id)
        status = response["JobStatus"]
        print("Job status: {}".format(status))
    return response

def get_confidence_of_table(table, number_of_confidence):
    table_result = table["Blocks"]
    confidence_list = []
    while number_of_confidence > 0:
        for item in table_result:
            if item["BlockType"] == "CELL":
                confidence_list.append(item["Confidence"])
        number_of_confidence -= 1
    return confidence_list

def format_wolfsberg_as_dict(wolfsberg_data):
    raw_data = [item for item in wolfsberg_data if item]
    objects = []
    for item in raw_data:
        if item.strip():
            # regex to split on comma, but only comma not within double quotes
            values = re.split(r',(?=(?:[^"]*"[^"]*")*[^"]*$)', item.strip())
            obj = {
                "No": values[0].strip().lower().replace(" ", ""),
                "Question": values[1].strip(),
                "Answer": values[2].strip() if len(values) > 2 else "",
            }
            objects.append(obj)

    return objects

def format_table_object(
    array_of_questions_answers, wolfsberg_to_ici_data, confidence_list
):
    wolfsberg_data = format_wolfsberg_as_dict(array_of_questions_answers)
    ici_data = []
    for i, item in enumerate(wolfsberg_to_ici_data, start=0):
        object = search_for_wolfsberg_answer(
            wolfsberg_data,
            item["wolfsberg"],
            item["ici"],
            confidence_list[i],
        )
        if object:
            ici_data.append(object)
    return ici_data

def search_for_wolfsberg_answer(
    wolfsberg_data, wolfsberg_question_number, ICI_question_number, confidence_score
):
    for item in wolfsberg_data:
        if item["No"] == wolfsberg_question_number:
            return {
                "no_ici": ICI_question_number,
                "answer": item["Answer"],
                "confidence_score": confidence_score,
            }
    return None

def find_by_tables(path, document_type, diligence_id):
    s3_bucket_name = "inputanalyze"
    document_path = os.path.realpath(".") + "{path}".format(path=path)
    directory_path = f'{os.path.realpath(".")}/media/documents/{diligence_id}'
    merged_document_name = f'merged_{document_path.split("/")[-1]}'
    merged_document_path = f'{directory_path}/{merged_document_name}'
    print(merged_document_path)
    

    splitter.pdf_splitter(document_path, directory_path, page_to_keep_wolfsberg, diligence_id)
    upload_to_s3(s3_bucket_name=s3_bucket_name, document_to_upload=merged_document_path, bucket_path=f'{diligence_id}/{document_type}/{merged_document_name}')
    textract_json = get_kv_map(s3_bucket_name, merged_document_path, diligence_id, document_type)
    confidence_list = get_confidence_of_table(textract_json, len(wolfsberg_to_ici_data))
    csv_table_formatted = get_tables_string(
        textract_json=textract_json,
        table_format=Pretty_Print_Table_Format.csv,
    )
    array_of_questions_answer = csv_table_formatted.split("\r\n")
    table_result = format_table_object(
        array_of_questions_answer, wolfsberg_to_ici_data, confidence_list
    )
    print(table_result)
    return table_result


if __name__ == "__main__":
    find_by_tables(
        path="/media/documents/1/wolfsbergBNP-Paribas-France.pdf",
        document_type="wolfsberg",
        diligence_id="1",
    )
