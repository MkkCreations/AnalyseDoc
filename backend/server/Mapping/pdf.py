import pdfrw

pdf = pdfrw.PdfReader('/Users/mohakk/Desktop/Python/PDF2/DueDeligence.pdf')
writer = pdfrw.PdfWriter()

def radio_button(annotation, value=True):
    for each in annotation['/Parent']['/Kids']:
        if each['/FT'] == '/Btn' and each['/T'] == '(4)':
    
            if value:
                each['/Kids'][0]['/AP'].update(pdfrw.PdfDict(N=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))
            else :
                each['/Kids'][1]['/AP'].update(pdfrw.PdfDict(N=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))



for page in pdf.pages:
    annotations = page.get('/Annots')

    if annotations is None:
        continue

    for annotation in annotations:
        if '/Parent' in annotation.keys() and '/FT' in annotation.keys():
            radio_button(annotation, False)


writer.write('/Users/mohakk/Desktop/Python/PDF2/Radioooo2.pdf', pdf)
