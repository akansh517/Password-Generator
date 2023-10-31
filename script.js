const inputSlider=document.querySelector("[data-lengthSlider]"); //custom attribute fetch krne ka syntax
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMSg]");
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector('.generateButton');
const allCheckBox=document.querySelectorAll("input[type=checkbox]"); //sare checkboxes ko darshata hai 
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';   //symbol string which is hardcode

// all elements fetched above by using querySelector 

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

// set strength circle to gray 
setIndicator("#ccc");

// handleSlider() vaal fxn ka kaam sirf itna hai passwordLength ko ui ke upar reflect krva data hai 
// set passwordLength 
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;           //width on formula basis          height by default
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%"
}

// setIndicator ka kam itna hai jo indictor hai color vala usme input parameter vala color or shadow set kar deta hai 
function setIndicator(color){  //color or shadow set krna 
    indicator.style.background=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    // Math.random() generate krta random Node. in between 0 and 1 mne multiply krdia max-min ke sath toh ab iski value 0 se leka max-min tak ayegi 
    return Math.floor(Math.random()*(max-min))+min; //ye mujhe min se leke max tak integer dega dono taraf min add krna padega agar min-max tak ki range chaiye toh

}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    //String.fromCharCode(ascii value) se mujhe ye character main convert krke de dega
    return String.fromCharCode(getRndInteger(97,123));//lowercase a ki ascii value 97 , 123 lower case z ki ascii value
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91)); //uppercase asci A -65 Z-91
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    //niche vala 4 variable se state pata chal gyi konsa checked hai or konsa nhi
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    //kisi bhi checkbox ke element ko tick kr deta hu toh aur agar hum verify krna chahte hai kya ye checkbox ticked hai yaa na ya nhi hai toh uske liya main .checked property use krta hu 
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(symbolsCheck.checked) hasSym=true;
    if(numbersCheck.checked) hasNum=true;

    if(hasUpper && hasLower && (hasSym||hasNum) && passwordLength>=8 ){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum && hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        // is method ke dawara main clipboard par copy kr skta hu 
        await navigator.clipboard.writeText(passwordDisplay.value);
        // writeText method mujhe Promise return krta hai 
        // jese hi promise resolve ho jaega vse hi main copied vala msg dal dunga 
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed"
    }
    //to make copy vala span visible 
    copyMsg.classList.add("active");
    // after 2 second active class hat jaegi uski liya setTimeout event use kiya 
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

 // Fisher yates method for shuffling the array 
 function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // random j 
        const j = Math.floor(Math.random() * (i + 1));
        // swap no. at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// jab bhi input event slider main change ho raha hai toh e meri slider ke value darshata hai toh jo bhi value hogi wo meri passwordLength main aa jaegi jo slider ke current status ko dikhati hai usko mujhe copy krna hai to mne handleSlider() fxn call kr diya vo ui ke andar change krta hai 
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

// agar meri password generate vali display main value hogi tab hi main copy kar paunga 
copyBtn.addEventListener('click',()=>{
    // agar mera input passwordDisplay vala non empty hai toh copyContent() vala method call krna bss
    if(passwordDisplay.value) // or (password.length>0)
        copyContent();
});

// at least 1 checkbox check krna padega to generate a passowrd so mujhe checkbox ka count maintain krna padega uske lia mujhe checkboxes par listener lagana padega 

// hum dekh rahe hai ki humare pass koi esa variable hai jisme sare ke sare checkboxes stored ho 

   
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    // special condition 

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    //agar charo main se kisi bhi cehckbox ko tick yaa untick kar raha hu toh hum shuru se count kar rahe hai kitne checked hai or kitne unchecked by calling handleCheckBoxChange fxn 
    checkbox.addEventListener('change',handleCheckBoxChange);
})

// generate password ke upar event listener 

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount<=0)
        return;
    

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // lets start the journey to find new password 
    console.log("Starting the journey");
    // remove old password
    password="";

    // lets put the stuff mentioned by checkboxes 

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    // agar 10 length ka password hai aur 4 checkbox tick hai toh 4 main se 1 character daal diya baki 6 loop laga ke randomly dalne aa 

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }


    //compulsory addition 
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    console.log("Compulsory addition done");

    // Remaining addition 
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        console.log("randIndex"+randIndex);
        password+=funcArr[randIndex]();
    }

    console.log("Remaining addition done");

    // Shuffle the password

    password=shufflePassword(Array.from(password));  //password ki string ko array ki form main convert krke pass krdiya 

    console.log("Shuffling  done");

    // show in UI 

    passwordDisplay.value=password;

    console.log("UI addition done");

    // calcualate strength 
    calcStrength();

});


