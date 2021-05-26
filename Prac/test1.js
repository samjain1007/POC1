const items = [
  { name: 'Hilmar Cheese Company', dist: 71, tags: ['highlight', 'out'] },
  { name: 'California State University Stanislaus', dist: 3.8, tags: ['highlight'] },
  { name: 'Hilmar Country Plaza', dist: 14, tags: ['highlight'] },
  { name: 'Carnegie Arts Center', dist: 12, tags: ['out'] },
  { name: 'Ricos Pizza', dist: 10, tags: ['highlight', 'out'] },
  { name: 'Elegant Bull', dist: 94, tags: ['out'] },
  { name: 'ABCABAC', dist: 51, tags: ['out'] },
  { name: 'CGDFS', dist: 31, tags: ['highlight'] },
  { name: 'AHUEE', dist: 61, tags: ['highlight', 'out'] },
  { name: "Stevinson Ranch", dist: 91, tags: ['highlight', 'out'] },
  { name: "Castle Air Museum", dist: 81, tags: ['highlight'] },
  { name: "Gallo Center for the Arts", dist: 19, tags: ['highlight'] },
  { name: "E and J Gallo Winery", dist: 95, tags: ['highlight'] },
  { name: "Hot Rod Diner", dist: 10, tags: ['highlight'] },
  { name: "McHenry Museum and Mansion", dist: 14, tags: ['highlight'] },
  { name: "Dryden Park Golf Course", dist: 61, tags: ['highlight'] },
  { name: "Modesto Arch", dist: 17, tags: ['highlight'] },
  { name: "Patterson Westley Historical Society Museum", dist: 21, tags: ['highlight'] },

];//OBJECT DATA

items.sort(function (a, b) { return a.tags.length - b.tags.length }); //Done to test sorting , and to optimize further in future
items.reverse();

//Parsed the data into columns like Highlights and Outdoor and placed into the map , so that if a new column appears,it can be 
//handled appropriately
let index = 1;
function additem(columns, item, tags) {
  item.idx = index++;
  for (let tag of tags) {
    if (columns.has(tag) == false) {
      columns.set(tag, new Array());
    }
    columns.get(tag).push(item);
  }
}

const columns = new Map();
for (let i = 0; i < items.length; i++) {
  let item = items[i];
  let tags = item.tags;
  delete item.tags;
  additem(columns, item, tags);
}


let state = 0;//representing the column(eg. highlight or outdoor activities)
let lis = document.querySelectorAll('#nav>li');//navigator bar columns eg. highlight
let ol = document.querySelector('ol');

let oli = document.querySelectorAll('ol>li');//Locations , List item in ordered list(eg. Hilmar Cheese Company)
oli = Array.from(oli);//Array conversion
//console.log(oli);
let elements = columns.get('highlight');

let previouspage = new Array();//indices of locations , using this redundancy in reloading is removed
for (let i = 0; i < 6; i++) {
  previouspage.push(elements[i].idx);
  oli[i].innerHTML = elements[i].name + "<span>" + elements[i].dist + " km" + "</span>";//Initializing the ordered list with "Highlights" locations
}
console.log(previouspage);

document.querySelector('#prev').classList.add('unhighlight');//Disabling the prev button initially


document.querySelectorAll('#nav>li').forEach(function (e) {
  //console.log('event',e);
  e.addEventListener('click', function () {
    lis.forEach(function (li) {
      li.classList.remove('highlight');//Removing highlight from all other except selected one
      //console.log(this);
    })
    next = 0;
    document.querySelector('#page').innerHTML = next + "";

    this.classList.add('highlight');//Putting highlight to the selected one
    document.querySelector('#prev').classList.add('unhighlight');//Disabling previous button on the click of a column(EG HIGHLIGHT)

    let elements;
    if (this.id == "out") {
      elements = columns.get('out');//retrieving the array corresponding to outdoor act.
      state = 1;//column set to Outdoor Act
    }

    if (this.id == "high") {
      elements = columns.get('highlight');//retrieving the array corresponding to highlight.
      state = 0;//column set to Highlight
    }
    let t = (state == 0) ? 'highlight' : 'out';

    if (columns.get(t).length <= 6)
      document.querySelector('#next').classList.add('unhighlight');
    else
      document.querySelector('#next').classList.remove('unhighlight');//setting the next button on clicking of column

    //Inserting li inside ol , so that locations can be accomodated upon changing column  
    let size = oli.length;
    if (oli.length < 6) {
      let parent = document.querySelector('ol');
      while (size < 6) {
        let lichild = document.createElement("li");
        parent.appendChild(lichild);
        size++;
      }
    }


    oli = document.querySelectorAll('ol>li');
    oli = Array.from(oli);
    //setting html
    let currentpage = new Array();
    for (let i = 0; i < 6; i++) {
    //  console.log('hi');
      if (previouspage.length >= i + 1 && previouspage[i] == elements[i].idx)//removing redundancy
        console.log('Not updated');
      else{
        oli[i].innerHTML = elements[i].name + "<span>" + elements[i].dist + " km" + "</span>";
        console.log('Updated');
      }

      currentpage.push(elements[i].idx);
    }

    previouspage = currentpage;//updating previous
    console.log(currentpage.length);
    console.log(previouspage.length);
    //setting html(locations) depending upon the column selected
  })
});
let next = 0;
document.querySelector('#page').innerHTML = next + "";


//console.log(columns.get('highlight').length);
document.querySelectorAll('button').forEach(function (e) {
  e.addEventListener('click', function () {
    if (this.id == 'next') {
      let t = state == 0 ? 'highlight' : 'out';
      if ((next + 1) * 6 < columns.get(t).length) {//Validity of next(elements that can be filled till now is less than total elements(locations))
        document.querySelector('#prev').classList.remove('unhighlight');//whenever next is clicked prev is activated

        next++;
        document.querySelector('#page').innerHTML = next + "";

        let elements;
        if (state == 0) {
          elements = columns.get('highlight');
        }
        else if (state == 1) {
          elements = columns.get('out');
        }
        //  console.log(elements);
        let begin = 6 * next;//starting point of next page
        let itemsleft = elements.length - begin;//items left to displayed of a particular column
        //setting html
        let currentpage = new Array();
        for (let i = 0; i < Math.min(6, itemsleft); i++) {
            oli[i].innerHTML = elements[begin+i].name + "<span>" + elements[begin+i].dist + " km" + "</span>";
            currentpage.push(elements[begin+i].idx);
        }
        previouspage = currentpage;

        if (itemsleft <= 6) {
          this.classList.add('unhighlight');//deactivating the next button if next page is not needed
          //REMOVING EXTRA LIS in case the locations left are less than 6(Locations displayed at a time)
          for (let it = itemsleft; it < 6; it++) {
            oli[it].remove();
          }
          oli = oli.slice(0, itemsleft);
          //Resizing the oli array
        }
      }
    }
    else {
      //APPLICABILITY OF PREV
      if (next >= 1) {
        document.querySelector('#next').classList.remove('unhighlight');//If prev is activated , next will also be applicable

        next--;//Page--
        let begin = 6 * next;//beginning index
        document.querySelector('#page').innerHTML = next + "";
        //FETCHING THE COLUMN LOCATIONS
        if (state == 0)
          elements = columns.get('highlight');

        else if (state == 1)
          elements = columns.get('out');

        let size = oli.length;

        //RESIZING IN CASE THE NO OF ELEMENTS ARE LESS THAN 6
        //PS , if prev is applicable that means no of elements will be 6(max possible on a page)
        if (oli.length < 6) {
          let parent = document.querySelector('ol');
          while (size < 6) {
            let lichild = document.createElement("li");
            parent.appendChild(lichild);
            size++;
          }
        }
        //**AGAIN REINITIALIZING the oli array as the changes made in LI objects(above) have to get updated in oli. 
        oli = document.querySelectorAll('ol>li');
        oli = Array.from(oli);
        //setting html
        let currentpage = new Array();
        for (let i = 0; i < 6; i++) {
            oli[i].innerHTML = elements[begin+i].name + "<span>" + elements[begin+i].dist + " km" + "</span>";
            currentpage.push(elements[begin+i].idx);
        }
        previouspage = currentpage;
        if (next == 0)
          document.querySelector('#prev').classList.add('unhighlight');
      }//disabling prev if we get to the first page on clicking prev
    }
  })


});




