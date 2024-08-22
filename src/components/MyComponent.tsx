import React from "react";
import { Table } from "@/components/Card";
import { CardProps } from "@/types/cardtype";

const data: CardProps[] = [
  {
    title: "Development of Enhanced A...",
    description: "Build an advanced analytics dashboard integrating real-time data from multiple sources.",
    image: "https://spruko.com/demo/xintra/dist/assets/images/faces/6.jpg"
  },

];

const MyComponent = () => {
  return (
    <div>
      <Table data={data} />
    </div>
  );
};

export default MyComponent;
