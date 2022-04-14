
const mealEl=document.getElementById('meals');
const favoritecontainer=document.getElementById("fav-meals");
const searchTerm=document.getElementById("search-term")
const searchbtn=document.getElementById("search")
const mealPopup=document.getElementById("meal-popup");
const popupCloseBtn=document.getElementById("close-popup");
const mealinfoEl=document.getElementById("meal-info");
getRandomMeal();
fetchFavMeals();


async function getRandomMeal(){
    console.log('*****')
    const resp= await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respdata=await resp.json();
    const randomMeal=  respdata.meals[0];
    addMeal(randomMeal,true);
}

async function getMealById(id){
    const resp =await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const respdata= await resp.json();
    const meal=respdata.meals[0];
    return meal;
}

async function getMealBySearch(term){
    const resp=await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term);
    const respdata=await resp.json();
    const meals=  respdata.meals;
    console.log(meals)
    return meals

}


 function addMeal(mealData,random=false){
    const meal=document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML=`
        <div class="meal-header">
            ${random?`<span class="random">Random Recipe</span>`:''}
            <img src="${mealData.strMealThumb}" 
            alt="${mealData.strMeal}"/>
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fa fa-heart"></i>
            </button>
        </div>
    `;
    const btn=meal.querySelector(".meal-body .fav-btn")
    btn.addEventListener("click",()=>{
        if(btn.classList.contains("active")){
            removeMealsLS(mealData.idMeal);
            btn.classList.remove('active');
        }else{
            addMealsLS(mealData.idMeal);
            btn.classList.add('active');
        }
        
        
    })
    meal.addEventListener('click',()=>{
        showMealInfo(mealData);
    });
    mealEl.appendChild(meal)
}

function getMealsLS(){
    const mealIds=JSON.parse(localStorage.getItem("mealIds"));
    return mealIds=== null?[]:mealIds;
}

function addMealsLS(mealId){
    const mealIds=getMealsLS();
    localStorage.setItem("mealIds",JSON.stringify([...mealIds,mealId]));
}

function removeMealsLS(mealId){
    const mealIds=getMealsLS();
    localStorage.setItem("mealIds",JSON.stringify(mealIds.filter((id)=>id !== mealId)));
}

async function fetchFavMeals(){
    favoritecontainer.innerHTML="";
    const mealIds=getMealsLS();
     const meals=[];
    for (let i=0;i<mealIds.length;i++){
        const mealId =mealIds[i];
        mea= await getMealById(mealId);
        addmealtofav(mea)

    }

}



function addmealtofav(mealData){
    

    const favmeal=document.createElement('li');
    favmeal.innerHTML=`
        <img 
            src="${mealData.strMealThumb}" 
            alt="${mealData.strMeal}"></br>
            <span>${mealData.strMeal}</span>
            <button class="clear">
            <i class="fas fa-window-close"></i></button>

    `;
    const btn=favmeal.querySelector(".clear");
    btn.addEventListener("click",()=>{
        removeMealsLS(mealData.idMeal);
        fetchFavMeals();
    });
    favmeal.addEventListener('click',()=>{
        showMealInfo(mealData);
    });
   
    favoritecontainer.appendChild(favmeal)
}

function showMealInfo(mealData){
    // clean it up 
    mealinfoEl.innerHTML='';
    //  update meal info
    const mealEl=document.createElement('div');
    const ingrediant=[];
    for(let i=1;i<=20;i++){
        if(mealData["strIngredient"+i]){
            ingrediant.push(`${mealData["strIngredient"+i]}-${mealData["strMeasure"+i]}`);
        }else{
            break;
        }
    }
    mealEl.innerHTML=`
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="">
        <p>${mealData.strInstructions}</p>
        <ul>
            ${ingrediant.map(ing=>`
            <li>${ing}</li>`).join('')}
        
    `

    mealinfoEl.appendChild(mealEl)
    // show popup

    mealPopup.classList.remove('hidden');
}


searchbtn.addEventListener("click", async ()=>{
    mealEl.innerHTML=""

    const search =searchTerm.value
    const meals= await getMealBySearch(search);
    if(meals){
        meals.forEach((meal)=>{
            addMeal(meal);
        })
    }
})

popupCloseBtn.addEventListener('click',()=>{
    mealPopup.classList.add('hidden');
})



