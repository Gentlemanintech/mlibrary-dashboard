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
    useToast
   } from '@chakra-ui/react'
import { db, storage } from "../config/firebase";
import { getDocs, collection, addDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

const Current = () => {
    
    const [current, setCurrent] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const currentBooksRef = collection(db, "Current");

    const [bookName, setBookName] = useState('')
    const [bookAuthor, setBookAuthor] = useState('')
    const [imgLink, setImgLink] = useState('')
    const [dLink, setDlink] = useState('')
    const [review, setReview] = useState('')
    const toast = useToast();


    useEffect(() => {
       const getCurrent = async () => {
        try {
          const data = await getDocs(currentBooksRef);
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,  
           }));
           setCurrent(filteredData);
        } catch (err) {
          console.log(err.message)
      }
       }

       getCurrent();
    },[]);

    const addBook = async () => {
        try {
            if (!bookName && !bookAuthor && !imgLink && !review) {
               toast({
                  title: "Fill the spaces provided",
                  status: "warning",
                  duration: 2000,
                  isClosable: true,
                  position: "top",
                 });
                 return null
            }else {
              let file = imgLink

              const currentRef = ref(storage, `current/${file.name}`)
              const uploadTask = uploadBytesResumable(currentRef, file)

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
                console.log(err)
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref). then((downloadURL) => {
                  addDoc(currentBooksRef, {
                    title: bookName,
                    author: bookAuthor,
                    image: downloadURL,
                    link: dLink,
                    review: review,
                    createdAt: serverTimestamp(),
                    });
                    toast({
                    title: "Your new read has been added",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                  });
                  setBookName("");
                  setBookAuthor("");
                  setImgLink('');
                  setReview("");
                  setDlink("")
                })
              }
          )} 
         } catch (err) {
           console.log(err)
         }
    }

    const deleteCurrent = async (id) => {
        const currentDoc = doc(db, "Current", id)
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
            <Text fontSize={{base: "3xl", lg: "5xl"}} mb = "10px">Reading Now</Text>
                <Text fontSize={{base: "2xl", lg: "4xl"}} maxW = "500px" fontFamily="Alkatra" textAlign="center">{current.length > 1 ? 'Books': 'Book'} I'm currently reading.</Text>
            </Flex>
        </Box>
        <Box textAlign="center" mb = "20px">
            <Button onClick={onOpen}>Add Read</Button>
        </Box>
        <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add book you're reading</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Book Name</FormLabel>
              <Input placeholder='The Alchemist' value={bookName} onChange={(e) => setBookName(e.target.value)}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Book Author</FormLabel>
              <Input placeholder='Robert Greene' value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Book Image</FormLabel>
              <Input type='file' accept=".png, .jpg, .jpeg" onChange={(e) => setImgLink(e.target.files[0])} border={'none'} my={2}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Download Link</FormLabel>
              <Input placeholder='https://download.book' value={dLink} onChange={(e) => setDlink(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Review</FormLabel>
              <Textarea placeholder='This book is about...' value={review} onChange={(e) => setReview(e.target.value)} />
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
            <Heading as="h5" textAlign="start" fontSize={{base: "3xl", lg: "4xl"}} my = "20px" fontFamily="Alkatra">Current {current.length > 1 ? 'Reads': 'Read'}</Heading>
        </Box>
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {current.map((card) => (
           <Card textAlign="center" key={card.id}>
          <CardHeader>
           <Image src={card.image} alt={card.name} margin="10px auto"
            borderRadius='full'
            boxSize='100px'/>
            <Heading size='md'>{card.title}</Heading>
          </CardHeader>
          <CardBody>
            <Text noOfLines={3}>{card.review}</Text>
          </CardBody>
          <CardFooter>
            <Button margin="5px auto" onClick={() => deleteCurrent(card.id)}
            >Delete</Button>
          </CardFooter>
        </Card> 
        ))}
      </SimpleGrid>
        </>
       
    )
 }
 
 export default Current