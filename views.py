
import pytesseract

class text_extraction(ModelViewSet):
    
    queryset = TextExtraction.objects.all()
    serializer_class = TextExtractionSerializer

    def extract_text(self,file_path):
        text = ""
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)

            return text
        except Exception as e:
            return str(e)
    
    def create(self, request, *args, **kwargs):
        
        serializer = TextExtractionSerializer(data=request.data)
        
        if serializer.is_valid():
            new_instance = serializer.save()
            str_instance = str(new_instance)
            print("New instance",new_instance,type(new_instance),sep="\n")
            print("Str instance", str_instance, type(str_instance), sep="\n")
            
            extract_data = self.extract_text(os.path.join(
                path+str_instance))
            print(extract_data)
                   
            response_data = {
                "status": "success",
                "message": "Text extraction data saved successfully.",
                'img_fig':serializer.data,
                "data": extract_data
            }
            
            return Response(response_data)

        # Return a success response
        else:
            return Response(serializer.errors)
