import pdfrw
import os

reader = pdfrw.PdfReader('/Users/mohakk/Desktop/AnalyseDoc/backend/server/Mapping/DueDeligence2.pdf')
writer = pdfrw.PdfWriter()

""" questions = {
    "1.1" : [["Financial Institution legal name", ""]["T", "1", "2"]],
    "1.2" : [["Registred address", ""]["T", "3", "4"]],
    "1.3" : [["Country of incorporation", ""]["T", "5", ""]],
    "1.4" : [["Are you a regulated entity?", "", True]["R", "R17", "R18"]],
    "1.4a" : [["If yes, what is your registred number", ""]["T", "6", "", "1.4"]],
    "1.4b" : [["If yes, what type of licences do you hold", ""]["T", "7", ""]],
} """

""" questionsPDF = {
    "1": ["T", "1.1", ""],
    "2": ["T", "1.1", ""],
    "3": ["T", "1.2", ""],
    "5": ["T", "1.3", ""],
    "4": ["T", "1.2", ""],
    "R17": ["R", "1.4", False],
    "R18": ["R", "1.4", False],
    "6": ["T", "1.4a", ""],
    "7": ["T", "1.4b", False],
    "R19": ["R", "1.4c", False],
    "R20": ["R", "1.4c", False],
    "R21": ["R", "1.4d", False],
    "R22": ["R", "1.4d", False],
    "R23": ["R", "1.5", False],
    "8": ["T", "1.6", ""],
    "9": ["T", "1.6", ""],
    "10": ["T", "1.6", ""] ,
    "11": ["T", "1.7a", ""],
    "12": ["T", "1.7a", "11"],
    "13": ["T", "1.7a", ""],
    "14": ["T", "1.7a", "13"],
    "15": ["T", "1.7a", ""],
    "16": ["T", "1.7a", "15"],
} """



def checkbox(annotation):
    annotation.update(pdfrw.PdfDict(V=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))

def text(annotation, text):
    annotation.update(pdfrw.PdfDict(V=text))
    
def radio(annotation, value=True):
    if value:
        annotation['/Parent']['Kids'][0]['/AP'].update(pdfrw.PdfDict(N=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))
    else :
        annotation['/Parent']['Kids'][1]['/AP'].update(pdfrw.PdfDict(N=pdfrw.objects.pdfname.BasePdfName(f'/Yes')))


def mapping():
    for page in reader.pages:
        annotations = page.get('/Annots')

        if annotations is None:
            continue

        for annotation in annotations:
            if annotation['/T'].decode()[0] == 'R':
                try:
                    print(annotation['/Parent']['/Kids'][0]['/AP'])
                    radio(annotation=annotation)
                except:
                    pass
            else:
                text(annotation, annotation['/T'].decode())
            
        '''    if annotation['/T'].decode() in questions:
                text(annotation, questions[annotation['/T'].decode()][1])
                
            if annotation['/FT'] == '/Btn' and annotation['/T'].decode() in checkboxes:
                checkbox(annotation)
                
            if '/Parent' in annotation.keys() and '/FT' in annotation.keys():
                for each in annotation['/Parent']['/Kids']:
                    if each['/FT'] == '/Btn' and each['/T'].decode() in radios.keys():
                        radio(each, radios[each['/T'].decode()]) '''
                
    writer.write(f'/Users/mohakk/Desktop/AnalyseDoc/backend/server/Mapping/Resultat1.pdf', reader)

mapping()