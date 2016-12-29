import * as imageloader from './imageloader';

import {GameWorld, Metadata, schema} from 'battlecode-playback';

const ARCHON = schema.BodyType.ARCHON;
const GARDENER = schema.BodyType.GARDENER;
const LUMBERJACK = schema.BodyType.LUMBERJACK;
const RECRUIT = schema.BodyType.RECRUIT;
const SOLDIER = schema.BodyType.SOLDIER;
const TANK = schema.BodyType.TANK;
const SCOUT = schema.BodyType.SCOUT;
const TREE_BULLET = schema.BodyType.TREE_BULLET;
const TREE_NEUTRAL = schema.BodyType.TREE_NEUTRAL;

const hex: Object = {
  1: "#a62014",
  2: "#0636ac"
};

/**
* Loads game stats: team name, victory points, bullets, robot count
* We make the distinction between:
*    1) Team names - a global string identifier i.e. "Teh Devs"
*    2) Team IDs - each Battlecode team has a unique numeric team ID i.e. 0
*    3) In-game ID - used to distinguish teams in the current match only;
*       team 1 is red, team 2 is blue
*/
export default class Stats {

  div: HTMLDivElement;
  images: imageloader.AllImages;

  // Key is the team ID, folllowed by the robot/stat type
  robotTds: Object = {};
  statTds: Object = {};

  // Note: robot types and number of teams are currently fixed regardless of
  // match info. Keep in mind if we ever change these, or implement this less
  // statically.
  readonly stats: string[] = ["Bullets", "Victory Points"];
  readonly robots: schema.BodyType[] = [
    ARCHON, GARDENER, LUMBERJACK, RECRUIT, SOLDIER, TANK, SCOUT
  ];

  constructor(teamNames: string[], teamIDs: number[], images: imageloader.AllImages) {
    this.images = images;
    this.div = this.baseDiv();
    this.div.appendChild(this.battlecodeLogo());

    if (teamNames.length != teamIDs.length) {
      throw new Error("different number of team names and team IDs");
    }

    // Add a section to the stats bar for each team in the match
    for (var index = 0; index < teamIDs.length; index++) {
      // Collect identifying information
      let teamID = teamIDs[index];
      let teamName = teamNames[index];
      let inGameID = index + 1; // teams start at index 1

      // Create td elements for the robot counts and store them in robotTds
      // so we can update these robot counts later; maps robot type to count
      let initialRobotCount: Object = {};
      for (let robot of this.robots) {
        let td: HTMLTableCellElement = document.createElement("td");
        td.innerHTML = "0";
        initialRobotCount[robot] = td;
      }
      this.robotTds[teamID] = initialRobotCount;

      // Similarly create td elements for the VPs, bullet count, and tree count;
      // maps stat type to count
      let initialStats: Object = {};
      for (let stat of this.stats) {
        initialStats[stat] = document.createElement("td");
        initialStats[stat].innerHTML = 0;
      }
      this.statTds[teamID] = initialStats;

      // Add the team name banner, the robot count table, and the stats table
      this.div.appendChild(this.teamHeaderNode(teamName, inGameID));
      this.div.appendChild(this.robotTable(teamID, inGameID));
      this.div.appendChild(this.overallStatsTable(teamID, inGameID));

      this.div.appendChild(document.createElement("br"));
      this.div.appendChild(document.createElement("br"));
    }
  }

  /**
   * Initializes the styles for the stats div
   */
  private baseDiv() {
    let div = document.createElement("div");

    // Positioning
    div.style.height = "100%";
    div.style.width = "300px";
    div.style.position = "fixed";
    div.style.zIndex = "1";
    div.style.top = "0";
    div.style.left = "0";
    div.style.overflowX = "hidden";

    // Inner style
    div.style.backgroundColor = "#151515";
    div.style.color = "white";
    div.style.textAlign = "center";
    div.style.fontSize = "16px";
    div.style.fontFamily = "Graduate";

    // Inner formatting
    div.style.padding = "10px";

    return div;
  }

  /**
   * Battlecode logo or title, at the top of the stats bar
   */
  private battlecodeLogo() {
    let logo: HTMLDivElement = document.createElement("div");
    logo.style.fontWeight = "bold";
    logo.style.fontSize = "40px";
    logo.style.textAlign = "center";
    logo.style.fontFamily = "Graduate";

    logo.style.paddingTop = "15px";
    logo.style.paddingBottom = "15px";

    let text = document.createTextNode("Battlecode");
    logo.appendChild(text);
    return logo;
  }

  /**
   * Colored banner labeled with the given teamName
   */
  private teamHeaderNode(teamName: string, inGameID: number) {
    let teamHeader: HTMLDivElement = document.createElement("div");
    teamHeader.style.padding = "14px";
    teamHeader.style.fontSize = "20px";
    teamHeader.style.marginTop = "5px";
    teamHeader.style.marginBottom = "10px";

    let teamNameNode = document.createTextNode(teamName);
    teamHeader.style.backgroundColor = hex[inGameID];
    teamHeader.appendChild(teamNameNode);
    return teamHeader;
  }

  /**
   * Create the table that displays the robot images along with their counts.
   * Uses the teamID to decide which color image to display.
   */
  private robotTable(teamID: number, inGameID: number) {
    let table: HTMLTableElement = document.createElement("table");
    table.setAttribute("align", "center");

    // Create the table row with the robot images
    let robotImages: HTMLTableRowElement = document.createElement("tr");
    for (let robot of this.robots) {
      let robotName: string = this.bodyTypeToString(robot);
      let td: HTMLTableCellElement = document.createElement("td");
      td.appendChild(this.images.robot[robotName][inGameID]);
      robotImages.appendChild(td);
    }
    table.appendChild(robotImages);

    // Create the table row with the robot counts
    let robotCounts: HTMLTableRowElement = document.createElement("tr");
    for (let robot of this.robots) {
      let td: HTMLTableCellElement = this.robotTds[teamID][robot];
      robotCounts.appendChild(td);
    }
    table.appendChild(robotCounts);

    return table;
  }


  private overallStatsTable(teamID: number, inGameID: number) {
    let table: HTMLTableElement = document.createElement("table");
    table.setAttribute("align", "center");
    table.style.marginTop = "10px";

    // Create a table row for each stat
    for (let stat of this.stats) {
      let tr: HTMLTableRowElement = document.createElement("tr");

      let tdLabel: HTMLTableCellElement = document.createElement("td");
      tdLabel.appendChild(document.createTextNode(stat));
      tdLabel.style.fontFamily = "Graduate";
      tdLabel.style.color = hex[inGameID];
      tdLabel.style.textAlign = "right";
      tdLabel.style.padding = "5px";
      tr.appendChild(tdLabel);

      let tdCount: HTMLTableCellElement = this.statTds[teamID][stat];
      tdCount.style.paddingLeft = "10px";
      tdCount.style.textAlign = "left";
      tr.appendChild(tdCount);

      table.appendChild(tr);
    }

    return table;
  }

  private bodyTypeToString(bodyType: schema.BodyType) {
    switch(bodyType) {
      case ARCHON: return "archon";
      case GARDENER: return "gardener";
      case LUMBERJACK: return "lumberjack";
      case RECRUIT: return "recruit";
      case SOLDIER: return "soldier";
      case TANK: return "tank";
      case SCOUT: return "scout";
      default:
        throw new Error("invalid body type");
    }
  }

  /**
   * Change the robot count on the stats bar
   */
  setRobotCount(teamID: number, robotType: schema.BodyType, count: number) {
    let td: HTMLTableCellElement = this.robotTds[teamID][robotType];
    td.innerHTML = String(count);
  }

  /**
   * Change the count on the stats bar
   * @param stat "Victory Points" or "Bullets"
   */
  setTeamStat(teamID: number, stat: string, count: number) {
    let td: HTMLTableCellElement = this.statTds[teamID][stat];
    td.innerHTML = String(count);
  }
}
