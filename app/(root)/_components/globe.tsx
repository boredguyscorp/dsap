import GlobeClient from './globe-client'

interface MarkerProps {
  location: [number, number]
  size: number
}

export default async function Globe() {
  // const response = await fetch(
  //   `https://api.us-east.tinybird.co/v0/pipes/coordinates.json`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
  //     },
  //     next: {
  //       revalidate: 43200, // every 12 hours
  //     },
  //   },
  // )
  //   .then((res) => res.json())
  //   .then((res) => res.data);

  // const markers = response.map(({ latitude, longitude }, idx) => {
  //   return {
  //     location: [latitude, longitude],
  //     size: 0.075 - (0.075 / 50) * idx,
  //   };
  // });

  //   { location: [37.7595, -122.4367] },
  // { location: [40.7128, -74.006] },
  // { location: [52.520008, 13.404954] },
  // { location: [51.507351, -0.127758] },
  // { location: [35.689487, 139.691711] },
  // { location: [22.396427, 114.109497] },
  // { location: [30.047503, 31.233702] },
  // { location: [-33.86882, 151.20929] },
  // { location: [-9.746956, -44.261249] }

  const markers: MarkerProps[] = [
    { location: [37.7595, -122.4367], size: 0.08 },
    { location: [40.7128, -74.006], size: 0.08 },
    { location: [52.520008, 13.404954], size: 0.08 },
    { location: [51.507351, -0.127758], size: 0.08 },
    { location: [35.689487, 139.691711], size: 0.08 },
    { location: [22.396427, 114.109497], size: 0.08 },
    { location: [30.047503, 31.233702], size: 0.08 },
    { location: [-33.86882, 151.20929], size: 0.08 },
    { location: [-9.746956, -44.261249], size: 0.08 }
  ]

  return <GlobeClient markers={markers} />
}
