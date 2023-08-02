<script lang="ts">
  import type {
    StationInfo,
    StationInfoRoot,
    StationStatusRoot,
  } from "$lib/types";
  import { onMount } from "svelte";

  let finding = false;
  let station: Awaited<ReturnType<typeof nearestOpenStation>> = null;

  $: console.log({ finding, station });

  function find() {
    finding = true;
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      //   TODO

      nearestOpenStation({ longitude, latitude }).then((_station) => {
        finding = false;
        station = _station;
      });
    });
  }

  export const nearestOpenStation = async ({
    longitude: lon,
    latitude: lat,
  }: {
    longitude: number;
    latitude: number;
  }) => {
    function dist(station: StationInfo) {
      return Math.sqrt(
        Math.pow(station.lat - lat, 2) + Math.pow(station.lon - lon, 2)
      );
    }

    const {
      data: { stations: stationInfo },
    } = (await fetch(
      "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"
    ).then((r) => r.json())) as StationStatusRoot;

    const stationInfoMap = new Map(
      stationInfo.map((info) => [info.station_id, info])
    );
    const {
      data: { stations },
    } = (await fetch(
      "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
    ).then((r) => r.json())) as StationInfoRoot;
    const nearest = stations
      .map((station) => {
        const info = stationInfoMap.get(station.station_id);
        return {
          ...station,
          info,
        };
      })
      .filter((station) => {
        if (station.info?.station_status === "out_of_service") return false;
        return station.info?.num_docks_available === station.capacity;
      })
      .slice()
      .sort((a, b) => {
        return dist(a) - dist(b);
      });
    const nearestStation = nearest[0];
    if (nearestStation) {
      return nearestStation;
    }
    return null;
  };

  onMount(find)
</script>

{#if finding}
  loading...
{/if}

{#if station}
  <h1>
    The nearest empty station is: {station.name}.
  </h1>
  <a href="https://maps.google.com/?q={station.lat},{station.lon}">
    Get directions
  </a>
  {#if station.info}
    <span>
      Last updated at {new Date(
        station.info.last_reported * 1000
      ).toLocaleString()}
    </span>
  {/if}
  <pre>
    {JSON.stringify(station, null, 2)}
  </pre>
{/if}

{#if !finding}
  <button on:click={find}> Find nearest Empty Citibike </button>
{/if}

<style>
  h1 {
    font-size: 4rem;
  }
</style>
