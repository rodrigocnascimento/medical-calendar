interface Mapper<T, U> {
  (data: T): U;
}

export default function ListMapper<T, U>(
  mapperFunction: Mapper<T, U>
): (data: T[]) => U[] {
  return (data: T[]): U[] => {
    if (data) return data.map(mapperFunction);
    return [];
  };
}
