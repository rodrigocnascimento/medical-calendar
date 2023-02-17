export interface MockDataOptions<T> {
  customData?: Partial<T>;
  quantityToGenerate?: number;
}

function customObjectPropertyOverload<T>(
  index: any,
  customData: any,
  mockedData: T,
) {
  const dataPropertyKeys = Object.keys(customData || {});

  for (const dataIndex of dataPropertyKeys) {
    const dataSubProperties = Object.keys(customData[dataIndex]);

    if (typeof customData[dataIndex] !== 'object') {
      mockedData[index][dataIndex] = customData[dataIndex];
    } else {
      for (const dataSubIndex of dataSubProperties) {
        mockedData[index][dataIndex][dataSubIndex] =
          customData[dataIndex][dataSubIndex];
      }
    }
  }

  return mockedData;
}

/**
 * Create a mock data with the given entity and custom data
 * @param entityObject {T[]} An generic array with entity objects
 * @param customData {Partial<T>} An object with custom data to be added to the entity
 * @returns
 */
export function createMockData<T>(
  entityObject: T[],
  customData: MockDataOptions<T>['customData'] = {},
): T | T[] {
  let mockedData: T[] = [];
  const quantityToGenerate = entityObject.length || 1;

  for (const [index, entity] of Object.entries(entityObject)) {
    mockedData.push(entity);

    mockedData = customObjectPropertyOverload<T[]>(
      index,
      customData,
      mockedData,
    );
  }
  return quantityToGenerate > 1 ? mockedData : mockedData.shift();
}
