import errorImg from "../images/no_found.png";
let data = [];
// const chart = document.querySelector(".chart");
const cardList = document.querySelector(".card-list");
const filterArea = document.querySelector(".filter-area");
const filterData = document.querySelector(".filter-data");
const inputName = document.querySelector("#inputName");
const inputUrl = document.querySelector("#inputUrl");
const inputArea = document.querySelector("#inputArea");
const inputPrice = document.querySelector("#inputPrice");
const inputSet = document.querySelector("#inputSet");
const inputStar = document.querySelector("#inputStar");
const inputDescription = document.querySelector("#inputDescription");
const addBtn = document.querySelector("#addBtn");
//重新載入
function init() {
  axios
    .get(
      "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json"
    )
    .then(function (response) {
      // console.log(response);
      data = response.data;
      // console.log(data)
      console.log(data.length);
      c3Data();
      render();
    });
}

init();
//渲染資料
function render() {
  let str = "";
  // let str2 = "";
  let count = 0;
  data.forEach(function (item, index) {
    let formattedPrice = item.price.toLocaleString();
    str += `
    <div class="col">
      <div class="card h-100">
      <div class="card-section">
        <span class="tag bg-secondary text-white">${item.area}</span>
        <img
          src="${item.imgUrl}"
          class="card-img-top img-fulid" alt="${item.area}"style="max-height:500px;height:233px">
        <span class="tag2 bg-primary text-white">${item.rate}</span>
      </div>
      <div class="card-body pb-14-cb">
        <h5 class="card-title fs-3 border-2-bottom pb-1 text-primary fw-med mb-0">${item.name}</h5>
        <p class="card-text pt-4 pb-22 text-light">${item.description}</p>
      </div>

      <ul class="card-footer m-0 d-flex justify-content-between align-items-center">
        <li class="d-flex text-primary">
          <span class="material-symbols-outlined">
            error
          </span>
          <p class="fw-med">剩下最後 ${item.group} 組</p>
        </li>
        <li class="d-flex text-primary align-items-center justify-content-center">
          <span class="me-1 fw-med">TWD</span>
          <p class="fs-2 font-Roboto fw-med">$${formattedPrice}</p>
        </li>
      </ul>
    </div>
    </div>
      `;
    count += 1;
  });
  filterData.textContent = `本次搜尋共 ${count} 筆資料`;
  cardList.innerHTML = str;
}
//篩選監聽
filterArea.addEventListener("change", function (e) {
  e.preventDefault();
  if (e.target.value == "") {
    console.log("你點擊到空的地方");
  }
  let str = "";
  let count = 0;
  data.forEach(function (item, index) {
    let formattedPrice = item.price.toLocaleString();
    if (e.target.value == item.area || e.target.value == "全部") {
      str += `
    <div class="col">
      <div class="card h-100">
      <div class="card-section">
        <span class="tag bg-secondary text-white">${item.area}</span>
        <img
          src="${item.imgUrl}"
          class="card-img-top img-fulid" alt="${item.area}" style="max-height:500px;height:233px">
        <span class="tag2 bg-primary text-white">${item.rate}</span>
      </div>
      <div class="card-body pb-14-cb">
        <h5 class="card-title fs-3 border-2-bottom pb-1 text-primary fw-med mb-0">${item.name}</h5>
        <p class="card-text pt-4 pb-22 text-light">${item.description}</p>
      </div>

      <ul class="card-footer m-0 d-flex justify-content-between align-items-center">
        <li class="d-flex text-primary">
          <span class="material-symbols-outlined">
            error
          </span>
          <p class="fw-med">剩下最後 ${item.group} 組</p>
        </li>
        <li class="d-flex text-primary align-items-center justify-content-center">
          <span class="me-1 fw-med">TWD</span>
          <p class="fs-2 font-Roboto fw-med">$${formattedPrice}</p>
        </li>
      </ul>
    </div>
    </div>
            `;
      count += 1;
    }
  });
  filterData.textContent = `本次搜尋共 ${count}筆資料`;
  cardList.innerHTML = str;
});
//判斷網址是否為真網址
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function c3Data() {
  //先從資料建立物件資料
  let areaAry =[];
  let obj2 ={};
  data.forEach(item=>{
    if(obj2[item.area] === undefined){
      obj2[item.area] =1;
    }else{
      obj2[item.area] +=1;
    }
  })
  //物件資料轉成陣列資料格式
  areaAry = Object.keys(obj2);
  // console.log(areaAry);

  let newData =[];
  areaAry.forEach(function(item,index){
    let arry = [];
    arry.push(item);
    arry.push(obj2[item]);
    newData.push(arry);
  })
  // console.log(newData);
  renderC3(newData);
}

function renderC3(newData){
  var chart = c3.generate({
    data: {
      colors: {
        台北: "#26C0C7",
        台中: "#5151D3",
        高雄: "#E68618",
      },
      columns: newData,
      type: "donut",
    },
    donut: {
      title: "套票地區比重",
    },
  });
}
//新增資料
function addData() {
  addBtn.addEventListener("click", function (e) {
    if (
      inputName.value == "" ||
      inputUrl.value == "" ||
      inputArea.value == "" ||
      inputPrice.value == "" ||
      inputSet.value == "" ||
      inputStar.value == "" ||
      inputDescription.value == ""
    ) {
      alert("請填寫欄位");
      return;
    }
    if (inputStar.value > 10 || inputStar.value < 1) {
      alert("請填寫套票星級1-10");
      return;
    }
    if (inputPrice.value < 1 || inputSet.value < 1) {
      alert("請填寫數值為正數");
      return;
    }
    let obj = {};
    obj.id = data.length;
    obj.name = inputName.value;
    obj.imgUrl = inputUrl.value;
    obj.area = inputArea.value;
    obj.price = inputPrice.value;
    obj.group = inputSet.value;
    obj.rate = inputStar.value;
    obj.description = inputDescription.value;
    data.push(obj);
    if (!isValidUrl(inputUrl.value)) {
      // 如果輸入的URL無效，設定為指定的圖片位址
      obj.imgUrl = errorImg; // 替換為您的指定圖片位址
    } else {
      obj.imgUrl = inputUrl.value;
    }
    c3Data();
    render();
    inputName.value = "";
    inputUrl.value = "";
    inputArea.value = "請選擇景點地區";
    inputPrice.value = "";
    inputSet.value = "";
    inputStar.value = "";
    inputDescription.value = "";
  });
}
addData();
