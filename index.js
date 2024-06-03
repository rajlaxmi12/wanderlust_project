const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust2";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(Mongo_URL);
}
 
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.send("hi! I am root");
});

//Index route
app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
});

//Create route
app.post("/listings", async(req, res) => {
    const newListing = new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

//Show route
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
});

//Edit Route
app.get("/listings/:id/edit", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
});

//Update route
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
});

// app.get("/testListing", async(req, res) => {
//     let sampleListing= new Listing({
//         title: "My new Vila",
//         description: "By the beach",
//         price: 2200,
//         location: "Calangute, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });