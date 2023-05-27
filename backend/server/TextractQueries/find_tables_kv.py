import os
import json
from pypdf import PdfReader, PdfWriter
from trp.t_pipeline import pipeline_merge_tables
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
from textractprettyprinter.t_pretty_print import convert_table_to_list
from IPython.display import display
from trp.t_pipeline import order_blocks_by_geo
import re

textract_client = boto3.client("textract")


def uploadS3(s3BucketName, documentName, diligenceId, documentType):
    s3 = boto3.client("s3")
    s3.upload_file(
        Filename=documentName,
        Bucket=s3BucketName,
        Key=str(diligenceId + "/" + documentType + "/" + documentName),
    )


def get_kv_map(s3BucketName, documentName, diligenceId, documentType):
    client = boto3.client("textract")
    response = client.start_document_analysis(
        DocumentLocation={
            "S3Object": {
                "Bucket": s3BucketName,
                "Name": str(diligenceId + "/" + documentType + "/" + documentName),
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


def PrettyPrintTables(textract_json):
    df = None
    table_count = 0
    tdoc = Document(textract_json)
    for page in tdoc.pages:
        for table in page.tables:
            table_count += 1
            df = pd.DataFrame(convert_table_to_list(trp_table=table))
            print("Table id:", table.id, "Row count:", len(df.index))
            display(df)


def split_pdf_and_process_tables(file, s3BucketName, diligenceId, documentType):
    inputpdf = PdfReader(open(file, "rb"), strict=False)
    array_of_questions_answer = []
    for i in range(len(inputpdf.pages)):
        output = PdfWriter()
        output.add_page(inputpdf.pages[i])
        with open(f"{i}.pdf", "wb") as outputStream:
            output.write(outputStream)
            uploadS3(s3BucketName, f"{i}.pdf", diligenceId, documentType)
            textract_json = get_kv_map(
                s3BucketName, f"{i}.pdf", diligenceId, documentType
            )
            csv_table_formatted = get_string(
                textract_json=textract_json,
                table_format=Pretty_Print_Table_Format.csv,
                output_type=[Textract_Pretty_Print.TABLES],
            )
            array_of_questions_answer.append(csv_table_formatted)
    return array_of_questions_answer


def format_wolfsberg_as_dict(wolfsberg_data):
    raw_data = [item for item in wolfsberg_data if item]
    objects = []
    for item in raw_data:
        if item.strip():
            # regex to split on comma, but only comma not within double quotes
            values = re.split(r',(?=(?:[^"]*"[^"]*")*[^"]*$)', item.strip())
            obj = {
                "No": values[0].strip().lower().replace(" ", "."),
                "Question": values[1].strip(),
                "Answer": values[2].strip() if len(values) > 2 else "",
            }
            objects.append(obj)

    for item in objects:
        print(item)

    return objects


def search_for_wolfsberg_answer(
    wolfsberg_data, wolfsberg_question_number, ICI_question_number
):
    for item in wolfsberg_data:
        if item["No"] == wolfsberg_question_number:
            return {
                "ICI_id": ICI_question_number,
                "Answer": item["Answer"],
            }
    return None


def main():
    s3BucketName = "inputanalyze"
    documentName = "./documents/BNP-WOLFSBERG-1-3.pdf"
    documentType = "WOLFSBERG"
    diligenceId = "1"

    uploadS3(s3BucketName, documentName, diligenceId, documentType)
    textract_json = get_kv_map(s3BucketName, documentName, diligenceId, documentType)
    csv_table_formatted = get_string(
        textract_json=textract_json,
        table_format=Pretty_Print_Table_Format.csv,
        output_type=[Textract_Pretty_Print.TABLES],
    )
    array_of_questions_answer = csv_table_formatted.split("\r\n")
    wolfsberg_data = format_wolfsberg_as_dict(array_of_questions_answer)


main()
