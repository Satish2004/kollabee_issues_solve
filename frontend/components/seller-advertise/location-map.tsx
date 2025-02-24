// "use client";

// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
// } from "react-simple-maps";
// import type { LocationRevenue } from "./revenue-data";

// interface LocationMapProps {
//   locations: LocationRevenue[];
// }

// export function LocationMap({ locations }: LocationMapProps) {
//   return (
//     <div className="h-[200px] mt-4">
//       <ComposableMap projection="geoMercator">
//         <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries-sans-antarctica.json">
//           {({ geographies }) =>
//             geographies.map((geo) => (
//               <Geography
//                 key={geo.rsmKey}
//                 geography={geo}
//                 fill="000000"
//                 stroke="ffffff"
//               />
//             ))
//           }
//         </Geographies>
//         {locations.map(({ city, coordinates }) => (
//           <Marker key={city} coordinates={coordinates}>
//             <circle r={4} fill="#ff4d4d" />
//           </Marker>
//         ))}
//       </ComposableMap>
//     </div>
//   );
// }


export function LocationMap() {
  return <div>LocationMap</div>;
}