import pdfrw
import os

reader = pdfrw.PdfReader(os.path.realpath('DueDeligence2.pdf'))
writer = pdfrw.PdfWriter()


def radio(annotation, value=True):
    annotation['/AP'].update(pdfrw.PdfDict(N=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))


for page in reader.pages:
    annotations = page.get('/Annots')

    if annotations is None:
        continue

    for annotation in annotations:
        if '/Parent' in annotation.keys():
            if annotation['/T'].decode()[0] == 'R':
                print(annotation['/AP'])
                radio(annotation)
            
writer.write(os.path.realpath('Radio.pdf'), reader)