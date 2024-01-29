/**
 * Created by JIANBO on 2016/7/31.
 */
//背景图
function drawBackground(){
    ctx2.drawImage(bgPic,0,0,canWidth,canHeight);
}
function drawPauseImage() {
  can4 = document.getElementById("canvas4");    //上層
  ctx4 = can4.getContext("2d");
  ctx4.clearRect(0, 0, canWidth, canHeight);

  ctx4.globalAlpha = 0.7;
  ctx4.shadowBlur = 15;
  ctx4.shadowColor = "white";
  ctx4.drawImage(data.pause ? playIcon : pause_image, canWidth - pause_image.width * 0.4 - 10, 10, pause_image.width * 0.4, pause_image.height * 0.4);
  ctx4.save();
}