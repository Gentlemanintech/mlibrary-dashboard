import { 
   Card, 
   Button, 
   Text, 
   Heading, 
   Image, 
   SimpleGrid, 
   CardHeader, 
   CardBody, 
   CardFooter, 
   Box, 
   Flex, 
   Divider, 
   useDisclosure,
   ModalOverlay,
   Modal,
   ModalContent,
   ModalHeader,
   ModalCloseButton,
   ModalBody,
   FormControl,
   FormLabel,
   Input,
   ModalFooter,
   Textarea,
   useToast,
  } from '@chakra-ui/react'
import { db, storage } from "../config/firebase";
import { getDocs, collection, addDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

const Suggestion = () => {
   
   const [suggest, setSuggest] = useState([]);
   const { isOpen, onOpen, onClose } = useDisclosure()
   const suggestBooksRef = collection(db, "Suggestions");

   const [bookName, setBookName] = useState('')
   const [user, setUser] = useState('M Library')
   const [imageLink, setImageLink] = useState('')
   const [description, setDescription] = useState('')
   const toast = useToast();


   useEffect(() => {
      const getSuggest = async () => {
       try {
         const data = await getDocs(suggestBooksRef);
         const filteredData = data.docs.map((doc) => ({
           ...doc.data(),
           id: doc.id,  
          }));
          setSuggest(filteredData);
       } catch (err) {
         console.log(err)
     }
      }

      getSuggest();
   },[]);

   const addBook = async () => {
       try {
           if (!bookName && !user && !imageLink && !description) {
              toast({
                 title: "Fill the spaces provided",
                 status: "warning",
                 duration: 2000,
                 isClosable: true,
                 position: "top",
                });
                return null
           }else {
            let file = imageLink

            const suggestRef = ref(storage, `Suggest-images/${file.name}`)
            const uploadTask = uploadBytesResumable(suggestRef, file)

            uploadTask.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              toast({
                 title: 'Upload is ' + progress + '% done',
                 status: "info",
                 duration: 500,
                 isClosable: false,
                 position: "bottom",
              })
              console.log('Upload is ' + progress + '% done');
            },
            (err) => {
              console.log(err.message)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref). then((downloadURL) => {
                addDoc(suggestBooksRef, {
                  bookName: bookName,
                  name: user,
                  imageLink: downloadURL,
                  description: description,
                  createdAt: serverTimestamp(),
                  });
                  toast({
                    title: "Your suggestion has been added",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                   });
                   setBookName("");
                   setUser("");
                   setImageLink('');
                   setDescription("");
              })
            })
        }  
        } catch (err) {
          console.log(err)
        }
   }

   const deleteSuggestion = async (id) => {
       const currentDoc = doc(db, "Suggestions", id)
       await deleteDoc(currentDoc)
       toast({
           title: "Deleted Successfully. Refresh the Page",
           status: "warning",
           duration: 2000,
           isClosable: true,
           position: "top",
          });
   }

   return (
       <>
       <Box>
           <Flex direction="row" justifyContent="space-around" wrap={{base: "wrap", lg: "nowrap"}} mb="10px" gap="4" p = "20px">
           <Text fontSize={{base: "3xl", lg: "5xl"}} mb = "10px">Suggestions</Text>
               <Text fontSize={{base: "2xl", lg: "4xl"}} maxW = "500px" fontFamily="Alkatra" textAlign="center">{suggest.length > 1 ? 'Books': 'Book'} Suggestions.</Text>
           </Flex>
       </Box>
       <Box textAlign="center" mb = "20px">
           <Button onClick={onOpen}>Add book</Button>
       </Box>
       <Modal
       isOpen={isOpen}
       onClose={onClose}
     >
       <ModalOverlay />
       <ModalContent>
         <ModalHeader>Add book you're suggesting to others</ModalHeader>
         <ModalCloseButton />
         <ModalBody pb={6}>
           <FormControl>
             <FormLabel>Username</FormLabel>
             <Input placeholder='John Doe' value={user} onChange={(e) => setUser(e.target.value)}/>
           </FormControl>
           <FormControl mt={4}>
             <FormLabel>Book Name</FormLabel>
             <Input placeholder='Rich Dad Poor Dad' value={bookName} onChange={(e) => setBookName(e.target.value)}/>
           </FormControl>
           <FormControl mt={4}>
             <FormLabel>Book cover</FormLabel>
            <Input type='file' accept=".png, .jpg, .jpeg" onChange={(e) => setImageLink(e.target.files[0])} border={'none'} my={2}/>
           </FormControl>
           <FormControl mt={4}>
             <FormLabel>Book Description</FormLabel>
             <Textarea placeholder='About the book' maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)}/>
           </FormControl>
         </ModalBody>

         <ModalFooter>
           <Button colorScheme='blue' mr={3} onClick={addBook}>
             Add Book
           </Button>
           <Button onClick={onClose}>Cancel</Button>
         </ModalFooter>
       </ModalContent>
     </Modal>

       <Divider />
       <Box>
           <Heading as="h5" textAlign="start" fontSize={{base: "3xl", lg: "4xl"}} my = "20px" fontFamily="Alkatra">{suggest.length > 1 ? 'Suggestions': 'Suggestion'}</Heading>
       </Box>
       <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
       {suggest.map((card) => (
          <Card textAlign="center" key={card.id}>
         <CardHeader>
          <Image src={card.imageLink} alt={card.bookName} margin="10px auto"
           borderRadius='full'
           boxSize='100px'/>
           <Heading size='md'>{card.name}</Heading>
         </CardHeader>
         <CardBody>
           <Text noOfLines={3}>{card.bookName}</Text>
         </CardBody>
         <CardFooter>
           <Button margin="5px auto" onClick={() => deleteSuggestion(card.id)}
           >Delete</Button>
         </CardFooter>
       </Card> 
       ))}
     </SimpleGrid>
       </>
      
   )
}

export default Suggestion