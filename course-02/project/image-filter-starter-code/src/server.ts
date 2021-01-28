import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { deleteLocalFiles, filterImageFromURL } from "./util/util";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get( "/filteredimage", async (
    req: Request, res: Response, next: NextFunction,
  ) => {
    // Access the provided "image_url" query parameter
    const imageUrl = req.query.image_url;

    // check Filename is valid
    if (!imageUrl) {
        return res.status(422).send({
          message: "image_url query parameter is required!",
        });
    }

    const filteredpath = await filterImageFromURL(imageUrl);

    res.status(200).sendFile(filteredpath, (err: Error) => {
      if (err) {
        next(err);
        res.status(500).send("Internal Server Error");
      } else {
        try {
          console.debug("Deleting this file locally " +
            `after we sent it to user: ${filteredpath}`);
          deleteLocalFiles([filteredpath]);
        } catch (e) {
          console.error(`Error deleting file ${filteredpath}: ${e}`);
        }
      }
    });
  });

  /**************************************************************************** */

  // ! END @TODO1
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
