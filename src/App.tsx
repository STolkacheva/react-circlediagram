import "./styles.css";
import { CircleDiagram } from "./Diagram/CircleDiagram";
import { CircleDiagramModel } from "./model/circleDiagramModel";
import { useState } from "react";

// первоначальный стейт
const initState: CircleDiagramModel[] = [
  { percent: 0.15, radius: 45 },
  { percent: 0.15, radius: 100 },
  { percent: 0.2, radius: 60 },
  { percent: 0.1, radius: 100 },
  { percent: 0.15, radius: 30 },
  { percent: 0.05, radius: 40 },
  { percent: 0.1, radius: 25 },
  { percent: 0.1, radius: 45 }
];

const innerRadius = 15;

const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function App() {
  const [items, setItems] = useState<CircleDiagramModel[]>(initState);

  // генерируем радиус больше чем внутренний +1, для корректной визуализации
  // генерируем доли по остаточному принципу
  const generate = () => {
    const count = getRandomIntInclusive(1, 8);
    let sumPercent = 100;
    let array: CircleDiagramModel[] = [];
    for (let index = 0; index < count; index++) {
      const radius = getRandomIntInclusive(innerRadius + 1, 100);
      const percent =
        index === count - 1 ? sumPercent : getRandomIntInclusive(0, sumPercent);
      sumPercent -= percent;
      array.push({ percent: count === 1 ? 1 : percent / 100, radius: radius });
    }
    setItems(array);
  };

  return (
    <div className="App">
      <CircleDiagram
        width={300}
        height={300}
        items={items}
        innerRadius={innerRadius}
        onClickCircle={generate}
      />
    </div>
  );
}
