import { types, Instance, cast } from 'mobx-state-tree';

const PropertyListingQuery = types
  .model('PropertyListingQuery', {
    search_latitude: types.optional(types.number, 14.5),
    search_longitude: types.optional(types.number, 120.9),
    zoom: types.optional(types.number, 6),
    bounding_box: types.optional(types.string, ''),
    polygon_path: types.optional(
      types.array(
        types.model({
          latitude: types.number,
          longitude: types.number,
        })
      ),
      []
    ),
    polygon_center: types.optional(
      types.model({
        latitude: types.number,
        longitude: types.number,
      }),
      { latitude: 14.5, longitude: 120.9 }
    ),
    max_distance_km: types.optional(types.number, 0),
    minLatitude: types.optional(types.number, 0),
    maxLatitude: types.optional(types.number, 0),
    minLongitude: types.optional(types.number, 0),
    maxLongitude: types.optional(types.number, 0),
  })
  .actions(self => ({
    updatePropertyListingQuery(
      key: keyof Instance<typeof PropertyListingQuery>,
      value: unknown
    ) {
      if (key === 'polygon_path' && Array.isArray(value)) {
        self.polygon_path = cast(value);
      } else if (
        key === 'polygon_center' &&
        typeof value === 'object' &&
        value !== null
      ) {
        self.polygon_center = value as { latitude: number; longitude: number };
      } else if (key in self) {
        // @ts-expect-error: dynamic assignment for MST model
        self[key] = value;
      }
    },
    resetCoordinates() {
      self.search_latitude = 14.5;
      self.search_longitude = 120.9;
      self.zoom = 6;
      self.bounding_box = '';
      self.polygon_path = cast([]);
      self.polygon_center = { latitude: 14.5, longitude: 120.9 };
      self.max_distance_km = 0;
      self.minLatitude = 0;
      self.maxLatitude = 0;
      self.minLongitude = 0;
      self.maxLongitude = 0;
    },
    updateAllCoordinates(coordinates: {
      search_latitude: number;
      search_longitude: number;
      minLatitude: number;
      maxLatitude: number;
      minLongitude: number;
      maxLongitude: number;
      bounding_box: string;
      polygon_path: { latitude: number; longitude: number }[];
      polygon_center: { latitude: number; longitude: number };
    }) {
      self.search_latitude = coordinates.search_latitude;
      self.search_longitude = coordinates.search_longitude;
      self.minLatitude = coordinates.minLatitude;
      self.maxLatitude = coordinates.maxLatitude;
      self.minLongitude = coordinates.minLongitude;
      self.maxLongitude = coordinates.maxLongitude;
      self.bounding_box = coordinates.bounding_box;
      self.polygon_path = cast(coordinates.polygon_path);
      self.polygon_center = coordinates.polygon_center;
    },
  }));

const RootStore = types.model('RootStore', {
  propertyListingQuery: PropertyListingQuery,
});

let store: RootStoreType | undefined;

export function useStore() {
  if (!store) {
    store = RootStore.create({
      propertyListingQuery: {
        search_latitude: 14.5,
        search_longitude: 120.9,
        zoom: 6,
        bounding_box: '',
        polygon_path: [],
        polygon_center: { latitude: 14.5, longitude: 120.9 },
        max_distance_km: 0,
        minLatitude: 0,
        maxLatitude: 0,
        minLongitude: 0,
        maxLongitude: 0,
      },
    });
  }
  return store;
}

export type RootStoreType = Instance<typeof RootStore>;
export type PropertyListingQueryType = Instance<typeof PropertyListingQuery>;
