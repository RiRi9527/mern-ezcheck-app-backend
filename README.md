Problem I solved:

----:

when the backend makes a data request, it keeps displaying 'in request indefinitely' 

becuase I worte wrong like this 

const createEvent = () = async (req: Request, res: Response) => {}


-----:


In Express.js, to read cookies, you need to use the cookie-parser middleware. This middleware helps you parse cookies sent by the client and places them into req.cookies. You can install it via npm

I didn't know in the beginning, so I got stuck wondering why I couldn't pass cookies


-----:

To handle file uploads using multer.

-----：

Save the file to Cloudinary and return the URL to store in MongoDB, MongoDB can save pictures. However, it's not typically recommended to store images directly in the database due to performance and scalability concerns. Instead, a common approach is to store images in the file system (or a cloud storage service) and store the file paths or URLs in the MongoDB documents.






