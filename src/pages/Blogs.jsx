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
import { db } from "../config/firebase";
import { getDocs, collection, addDoc, doc, deleteDoc, serverTimestamp} from "firebase/firestore";
import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

const Blogs = () => {
    
    const [blogs, setBlogs] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const blogsRef = collection(db, "Blogs");

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const toast = useToast();


    useEffect(() => {
       const getBlogs = async () => {
        try {
          const data = await getDocs(blogsRef);
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,  
           }));
           setBlogs(filteredData);
        } catch (err) {
          console.log(err)
      }
       }

       getBlogs();
    },[]);

    const addBlog = async () => {
        try {
            if (!title && !author && !image && !description) {
               toast({
                  title: "Fill the spaces provided",
                  status: "warning",
                  duration: 2000,
                  isClosable: true,
                  position: "top",
                 });
                 return null
            }else {
              let file = image

              const blogStorageRef = ref(storage, `blogs/${file.name}`)
              const uploadTask = uploadBytesResumable(blogStorageRef, file)

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
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  addDoc(blogsRef, {
                    title: title,
                    author: author,
                    image: downloadURL,
                    description: description,
                    createdAt: serverTimestamp(),
                    });
                    toast({
                    title: "Your blog has been added",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                   });
                   setTitle("");
                   setAuthor("");
                   setDescription("");
                   setImage('');
                })
              })
            }
          } catch (err) {
           console.log(err)
         }
    }

    const deleteBlog = async (id) => {
        const currentDoc = doc(db, "Blogs", id)
        const storageRef = ref(storage, `blogs/`)
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
            <Text fontSize={{base: "3xl", lg: "5xl"}} mb = "10px">Blogs</Text>
            </Flex>
        </Box>
        <Box textAlign="center" mb = "20px">
            <Button onClick={onOpen}>Add Blog</Button>
        </Box>
        <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add blogs.</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input placeholder='Why you should..' value={title} onChange={(e) => setTitle(e.target.value)}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Author</FormLabel>
              <Input placeholder='Robert Greene' value={author} onChange={(e) => setAuthor(e.target.value)}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              <Input type='file' accept=".png, .jpg, .jpeg" onChange={(e) => setImage(e.target.files[0])} border={'none'} my={2}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder='more details of the blog' value={description} onChange={(e) => setDescription(e.target.value)}/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={addBlog}>
              Add Blog
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        <Divider />
        <Box>
            <Heading as="h5" textAlign="start" fontSize={{base: "3xl", lg: "4xl"}} my = "20px" fontFamily="Alkatra">{blogs.length > 1 ? 'Blogs': 'Blog'}</Heading>
        </Box>
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {blogs.map((card) => (
           <Card textAlign="center" key={card.id}>
          <CardHeader>
           <Image src={card.image} alt={card.title} margin="10px auto"
            borderRadius='full'
            boxSize='100px'/>
            <Heading size='md'>{card.title}</Heading>
          </CardHeader>
          <CardBody>
            <Text noOfLines={3}>{card.author}</Text>
          </CardBody>
          <CardFooter>
            <Button margin="5px auto" onClick={() => deleteBlog(card.id)}
            >Delete</Button>
          </CardFooter>
        </Card> 
        ))}
      </SimpleGrid>
        </>
       
    )
 }
 
 export default Blogs