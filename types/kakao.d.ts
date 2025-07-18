declare global {
  interface Window {
    kakao: any
    daum: any
  }

  namespace kakao {
    namespace maps {
      class Map {
        constructor(container: HTMLElement, options: any)
        setCenter(latlng: LatLng): void
      }

      class LatLng {
        constructor(latitude: number, longitude: number)
        getLat(): number
        getLng(): number
      }

      class Marker {
        constructor(options: any)
        setMap(map: Map | null): void
        setPosition(position: LatLng): void
      }

      namespace services {
        class Geocoder {
          coord2RegionCode(lng: number, lat: number, callback: (result: any[], status: string) => void): void
        }

        class Places {
          keywordSearch(keyword: string, callback: (data: any[], status: string) => void): void
        }

        const Status: {
          OK: string
        }
      }

      const event: {
        addListener(target: any, type: string, callback: (...args: any[]) => void): void
      }
    }
  }
}

export {}
