# nba-pbp-video

Gets nba.com play-by-play videos from the 2019-20 season. 
For a working example, visit: https://mtthai.github.io/nba-play-viewer/

Ex:

```js
nba.getPBPVideoURL({EventNum: 31, GameID: '0011900002'}).then(function(data){
//'https://videos.nba.com/nba/pbp/media/2019/10/04/0011900002/31/aaed3664-88f2-a056-beca-d2411ab59c9a_1280x720.mp4'
```
An EventNum is a singular event (made/miss shot, foul, turnover, etc.) in play by play data:

```js
nba.playByPlay({GameID: '0021800848'}).then(function(data){
  console.log(data)
});
```
```
...
 { GAME_ID: '0021800848',
        EVENTNUM: 731, //in PBP data, it's uppercase
        EVENTMSGTYPE: 2,
        EVENTMSGACTIONTYPE: 79,
        PERIOD: 4,
        WCTIMESTRING: '10:00 PM',
        PCTIMESTRING: '0:37',
        HOMEDESCRIPTION: null,
        NEUTRALDESCRIPTION: null,
        VISITORDESCRIPTION: 'MISS James 26\' 3PT Pullup Jump Shot',
...
AvailableVideo: { VIDEO_AVAILABLE_FLAG: 1 }
```

A VIDEO_AVAILABLE_FLAG at the end of the PBP data will indicate if there's video available for the game.

GAME_IDs can be found in https://github.com/mtthai/nba-pbp-video/blob/master/schedule.json as "gid".

*VIDEO PLAY-BY-PLAY ONLY FOR 2019-2020 SEASON
