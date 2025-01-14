import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

const pictures = [
  {
    id: 1,
    image:
      "https://images.immediate.co.uk/production/volatile/sites/2/2018/09/OLI-0918_HereNow-CremeCaramel_28005-cb31e47.jpg?quality=90&webp=true&resize=600,545",
  },
  {
    id: 2,
    image:
      "https://www.allrecipes.com/thmb/y-S61IJkYyCUjTMGYqkaoJGwBrY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-228515-simple-creme-brulee-dessert-dmfs-4x3-821623e7a86548eeb89370ac23d5f251.jpg",
  },
  {
    id: 3,
    image:
      "https://assets.epicurious.com/photos/62d6c513077a952f4a8c338c/1:1/w_2848,h_2848,c_limit/PannaCotta_RECIPE_04142022_9822_final.jpg",
  },
];

function MyCarousel(props) {
  return (
    <Carousel autoPlay={false}>
      {/* {props.post.map((item, i) => (
        <Item key={i} item={item} />
      ))} */}
      <Item item={props.post} />
    </Carousel>
  );
}

function Item(props) {
  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
      }}
      elevation={0}
    >
      <img
        src={props.item.img}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        // alt={`Image ${props.item.id}`}
      />
    </Paper>
  );
}

export default MyCarousel;
