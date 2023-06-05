import pdfrw
import os

reader = pdfrw.PdfReader(f'{os.path.realpath(".")}/backend/server/Mapping/DueDeligence2.pdf')
writer = pdfrw.PdfWriter()


def radio(annotation, value=True):
    annotation['/AP'].update(pdfrw.PdfDict(N=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))

def check(annotation):
    annotation.update(pdfrw.PdfDict(V=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))

for page in reader.pages:
    annotations = page.get('/Annots')

    if annotations is None:
        continue

    for annotation in annotations:
        if annotation['/T'].decode() == '222':
            print(annotation['/AP'])
            check(annotation)
            
writer.write(os.path.realpath(f'{os.path.realpath(".")}/backend/server/Mapping/Radio.pdf'), reader)