from pypdf import PdfReader, PdfWriter
import os

def pdf_splitter(input_path, pages_to_keep, diligence_id=1):
    fname = os.path.splitext(os.path.basename(input_path))[0]

    pdf = PdfReader(input_path)
    pdf_writer = PdfWriter()

    for index, page in enumerate(pdf.pages):
        if index + 1 in pages_to_keep:
            pdf_writer.add_page(page)

    output_filename = f'./media/documents/{diligence_id}/merged_{fname}.pdf'
    print(output_filename)

    with open(output_filename, 'wb') as out:
        pdf_writer.write(out)

  
if __name__ == '__main__':
    path = './media/documents/1/wolfsbergBNP-Paribas-France.pdf'
    pages_to_keep = [5, 2, 8, 11, 4]

    pdf_splitter(path, pages_to_keep)