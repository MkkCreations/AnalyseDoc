import pdfrw


reader = pdfrw.PdfReader('/Users/mohakk/Desktop/Python/PDF2/DueDeligence.pdf')
writer = pdfrw.PdfWriter()

index = 0
for page in reader.pages:
    annotations = page.get('/Annots')

    if annotations is None:
        continue

    for annotation in annotations:
        if not annotation['/T']:
            index += 1
            print(annotation.keys(), index)
            annotation.update(pdfrw.PdfDict(T= 'R' + str(index)))
            print(annotation['/T'], index)
        else :
            index += 1
            annotation.update(pdfrw.PdfDict(T= str(index)))
            
            
writer.write('/Users/mohakk/Desktop/Python/PDF2/DueDeligence2.pdf', reader)