import "./CircleDiagramStyle.css";
import { CircleDiagramModel } from "../model/circleDiagramModel";

interface ICircleDiagram {
  items: CircleDiagramModel[];
  innerRadius: number;
  width: number;
  height: number;
  onClickCircle: () => void;
}

interface Point {
  x: number;
  y: number;
}

const color: string[] = [
  "#f2994a",
  "#eb5757",
  "#f2c94c",
  "#219653",
  "#56ccf2",
  "#2f80ed",
  "#9b51e0",
  "#6fcf97"
];

const getAngleCoords = (
  center: Point,
  angleRad: number,
  radius: number
): Point => {
  return {
    x: Math.cos(angleRad) * radius + center.x,
    y: Math.sin(angleRad) * radius + center.y
  };
};

// отрисовка сектора
const getSectorPath = (
  center: Point,
  fromAngleRad: number,
  toAngleRad: number,
  innerRadius: number,
  outerRadius: number
): string => {
  const fromInner = getAngleCoords(center, fromAngleRad, innerRadius);
  const toInner = getAngleCoords(center, toAngleRad, innerRadius);
  const fromOuter = getAngleCoords(center, fromAngleRad, outerRadius);
  const toOuter = getAngleCoords(center, toAngleRad, outerRadius);

  const half = toAngleRad - fromAngleRad > Math.PI ? 1 : 0;

  let path = `M ${fromInner.x} ${fromInner.y}`;
  path += ` L ${fromOuter.x} ${fromOuter.y}`;
  path += ` A ${outerRadius} ${outerRadius} 0 ${half} 1 ${toOuter.x} ${toOuter.y}`;
  path += ` L ${toInner.x} ${toInner.y}`;
  path += ` A ${innerRadius} ${innerRadius} 0 ${half} 0 ${fromInner.x} ${fromInner.y}`;

  return path;
};

// проверка входящих данных для корректной работы компонента
const checkItems = (
  items: CircleDiagramModel[],
  innerRadius: number,
  width: number,
  height: number
): boolean => {
  if (
    items.filter((i) => i.radius > width / 2 || i.radius > height / 2).length >
    0
  ) {
    console.log(
      "Присутвуют сектор(а) с радиусом превышающем ширину/высоту полотна"
    );
    return false;
  }

  if (items.length > color.length) {
    console.log("Сгенерировано больше значений, чем доступно цветов");
    return false;
  }

  if (items.reduce((c, v) => c + v.percent, 0) !== 1) {
    console.log("Сумма заданых долей не равна 1");
    return false;
  }

  if (items.filter((i) => i.radius < innerRadius).length > 0) {
    console.log("Присутвуют сектор(а), где внутренний радиус больше внешнего");
    return false;
  }

  return true;
};

export const CircleDiagram: React.FC<ICircleDiagram> = ({
  items,
  onClickCircle,
  innerRadius,
  width,
  height
}) => {
  if (!checkItems(items, innerRadius, width, height))
    return (
      <div className="error">
        {"Данные не корректны (см.лог)"}
        <button className="error-btn" onClick={onClickCircle}>
          reload
        </button>
      </div>
    );

  const colorCopy = color.slice(0);

  // преподготовка данных для дальнейшей отрисовки
  const data = items.map((item, i) => {
    const fromPercent = items.slice(0, i).reduce((c, v) => c + v.percent, 0);
    const toPercent = fromPercent + item.percent;

    return {
      fromAngleRad: 2 * Math.PI * fromPercent,
      toAngleRad: 2 * Math.PI * toPercent,
      radius: item.radius,
      percent: item.percent,
      color: colorCopy.shift()
    };
  });

  return (
    <div className="canvas">
      <svg
        className="chart"
        width={width}
        height={height}
        onClick={onClickCircle}
      >
        {data.map((item, i) => {
          return item.percent === 1 ? (
            // отрисовка полного круга
            <circle
              className="circle"
              key={i}
              r={data[0].radius}
              cx={width / 2}
              cy={height / 2}
              stroke={item.color}
              strokeWidth={data[0].radius}
            />
          ) : (
            // отрисовка сектора
            <path
              className="unit"
              key={i}
              fill={item.color}
              d={getSectorPath(
                { x: width / 2, y: height / 2 },
                item.fromAngleRad,
                item.toAngleRad,
                innerRadius,
                item.radius
              )}
            />
          );
        })}
      </svg>
      <div className="legend">
        <p className="title">Элементы</p>
        <div className="caption-list">
          {data.map((item, i) => (
            <div className="caption-item" key={i}>
              <div className="item-color" style={{ background: item.color }} />
              <div className="item-text">
                {`R:${item.radius}, ${Math.floor(item.percent * 100)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
