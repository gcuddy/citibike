<script lang="ts">
  let finding = false;
  let station = "";

  $: console.log({finding, station})

  function find() {
    finding = true;
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      //   TODO

      nearestOpenStation({ lon: longitude, lat: latitude }).then((_station) => {
        finding = false;
        station = _station;
      });
    });
  }

  export const nearestOpenStation = async ({ lon, lat }) => {
    lon = +lon;
    lat = +lat;
    function dist(station) {
      return Math.sqrt(
        Math.pow(station.lat - lat, 2) + Math.pow(station.lon - lon, 2)
      );
    }
    const {
      data: { stations: stationInfo },
    } = await fetch(
      "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"
    ).then((r) => r.json());
    const stationInfoMap = new Map(
      stationInfo.map((info) => [info.station_id, info])
    );
    const {
      data: { stations },
    } = await fetch(
      "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
    ).then((r) => r.json());
    const nearest = stations
      .map((station) => {
        const info = stationInfoMap.get(station.station_id);
        return {
          ...station,
          info,
        };
      })
      .filter((station) => {
        return station.info.num_docks_available === 0;
      })
      .slice()
      .sort((a, b) => {
        return dist(a) - dist(b);
      });
    const nearestStation = nearest[0];
    if (nearestStation) {
      return nearestStation.name;
    }
    return "";
  };
</script>

{#if finding}
  loading...
{/if}

{#if station}
  <h1>
    The nearest empty station is: {station}
  </h1>
{/if}

<button on:click={find}> Find nearest Empty Citibike </button>

<style>
  h1 {
    font-size: 4rem;
  }
</style>
