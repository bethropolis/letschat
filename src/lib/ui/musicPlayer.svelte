<script context="module">
  import { current, is_playing } from "./../../store.js";
</script>

<script>
  import { onDestroy, onMount } from "svelte";
  export let musicProps;

  let timeLength = "";
  let timeFrame = 1;
  let onScreen;
  let isPlaying = false;
  let musicPlayer = {};

  // Function to play music
  function play() {
    onScreen = TextTrackCue;
    musicPlayer.play();
    isPlaying = true;
  }

  // Function to pause music
  function pause() {
    onScreen = TextTrackCue;
    musicPlayer.pause();
    isPlaying = false;
  }

  // Function to toggle play/pause of music
  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  // Function to toggle mute of music
  function toggleMute() {
    musicPlayer.muted = !musicPlayer.muted;
  }

  // Function to seek the music
  function seek(e) {
    musicPlayer.currentTime = (e.target.value / 100) * musicPlayer.duration;
  }

  // Function to update time length of music
  function updateTimeLength() {
    if (musicPlayer) {
      timeFrame = (musicPlayer.currentTime / musicPlayer.duration) * 100;
      const remainingTime = Math.ceil(
        musicPlayer.duration - musicPlayer.currentTime
      );
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      timeLength = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  }
  // On mount function to add event listeners
  onMount(() => {
    if ($current instanceof HTMLAudioElement) {
      if ($current.src == musicPlayer.src) {
        $current.pause();
        musicPlayer.currentTime = $current.currentTime;
        play();
      }
    }
    musicPlayer.addEventListener("timeupdate", updateTimeLength);
  });

  onDestroy(() => {
    musicPlayer.removeEventListener("timeupdate", updateTimeLength);
    isPlaying = false;
  });

</script>

<main>
  {#if musicProps}
    <audio
      bind:this={musicPlayer}
      src={musicProps.src}
      on:pause={pause}
      on:play={(e) => {
        const audio = e.currentTarget;
        if (audio != $current) {
          $current?.pause();
          $current = audio;
        }
      }}
    />
  {/if}
  <div class="controls">
    <button on:click={togglePlay}>
      {#if isPlaying}
        <i class="fa fa-pause" />
      {:else}
        <i class="fa fa-play" />
      {/if}
    </button>
    <div class="sleek">
      <input
        class="slider"
        type="range"
        min="0"
        max="100"
        bind:value={timeFrame}
        on:change={seek}
        style="flex: 1;"
      />
    </div>
    <div class="time-remaining">{timeLength}</div>
  </div>
</main>

<style>
  /* get :root variables from ../../app.svelte */
  main {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .controls {
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    position: relative;
    height: auto;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
    display: flex;
    padding: 1rem;
    border-radius: 5px;
  }

  button:hover {
    color: var(--secondary-color);
  }

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 18px;
    color: var(--primary-color);
  }
  .slider {
    -webkit-appearance: none;
    width: 1fr;
    height: 2px;
    border-radius: 2px;
    background-color: var(--primary-color);
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .time-remaining {
    font-size: 0.75rem;
    color: var(--primary-color);
    font-family: sans-serif;
  }
  .sleek {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
  }
</style>
