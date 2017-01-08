/**
 * All of the top-level tunable options for the game client.
 */
export interface Config {
  /**
   * The version of the game we're simulating.
   */
  readonly gameVersion: string;

  /**
   * Whether to try to run the game in full-screen
   */
  readonly fullscreen: boolean;

  /**
   * Dimensions of the canvas
   */
  readonly width: number;
  readonly height: number;

  /**
   * Turns per second.
   * 
   * (DISTINCT from fps!)
   */
  readonly defaultTPS: number;

  /**
   * The url to listen for websocket data on, if any.
   */
  readonly websocketURL: string | null;

  /**
   * How often to poll the server via websocket, in ms.
   */
  readonly pollEvery: number;

  /**
   * Whether or not to interpolate between frames.
   */
  interpolate: boolean;

  /**
   * Whether or not to display health bars
   */
  healthBars: boolean;

  /**
   * Whether or not to draw a circle under each robot
   */
  circleBots: boolean;

  /**
   * Whether or not to display indicator dots and lines
   */
  indicators: boolean;

  /**
   * True for game mode, false for map editor mode
   */
  inGameMode: boolean;

  /**
   * Whether to show help information in the stats bar
   */
  inHelpMode: boolean;
}

/**
 * Handle setting up any values that the user doesn't set.
 */
export function defaults(supplied?: any): Config {
  supplied = supplied || {};
  return {
    gameVersion: supplied.gameVersion || "ANY",
    fullscreen: supplied.fullscreen || false,
    width: supplied.width || 600,
    height: supplied.height || 600,
    defaultTPS: supplied.defaultTPS || 20,
    websocketURL: supplied.websocketURL || null,
    pollEvery: supplied.pollEvery || 500,
    interpolate: true,
    healthBars: true,
    circleBots: false,
    indicators: true,
    inGameMode: true,
    inHelpMode: false
  };
}
