import pdfrw
import os


reader = pdfrw.PdfReader(os.path.realpath(".")+"/Mapping/DueDeligence2.pdf")
writer = pdfrw.PdfWriter()



def checkbox(annotation):
    annotation.update(pdfrw.PdfDict(V=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))

def text(annotation, text):
    annotation.update(pdfrw.PdfDict(V=text))
    
def radio(annotation, value=True):
    annotation['/AP'].update(pdfrw.PdfDict(N=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))


def mapping(mappingData, diligence_id):

    for page in reader.pages:
        annotations = page.get('/Annots')

        if annotations is None:
            continue

        for annotation in annotations:
            for key in mappingData:
                if annotation['/T'].decode() == key['num_map'] and key['q_type'] == 'T':
                    text(annotation, key['answer'])
                elif annotation['/T'].decode() == key['num_map'] and key['q_type'] == 'R':
                    radio(annotation)
                elif annotation['/T'].decode() == key['num_map'] and key['q_type'] == 'C':
                    checkbox(annotation)
                
    writer.write(f'{os.path.realpath(".")+"/TextractQueries/media/ici/"}ici{diligence_id}.pdf', reader)
    
    return f'ici{diligence_id}.pdf'
