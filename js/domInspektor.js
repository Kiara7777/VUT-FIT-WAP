/*
Projekt: DOM inspektor do predmetu WAP
Autor: Sara Skutova, xskuto00@stud.fit.vutbr.cz
Soubor: domInspektor.css
*/

let divPanel;

let oldTarget; //Globalni promenna, do ni se uklada element, ktery byl obarven

let all = [];
let allLi = [];

let divModal;
let spanClose;
let h4Modal;
let classModal;
let idModal;
let form;

let changingNode;

/*
 * Funkce ktera vola vsechny potrebne funkce pro vytvoreni tela inspektoru
 */
function createInspektor()
{
    addCSS(); //nahraje do hlavicky css pro inspektor
    setEventBody(); //definovani obsluznych funkci pro udalosti nakter ma reagovat puvodni telo
    
    createInspektorElem(); // tvoreni tela inspektrou
    
    modalWindow(); //pomocny "dialog" pro meneni atributu class a id
    setEventDialog();
}

/*
 * Funkce do hlavicky HTML vlozi odkaz na css soubor s definicemi, ktere jsou 
 * definovany pro inspektor - styl inspektoru
 */
function addCSS()
{
    let style = document.createElement('link');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.href = "css/inspektor.css";
    
    document.getElementsByTagName('head')[0].appendChild(style);
    
}

/*
 * Eventy na ktere ma reagovat cast puvodniho dokumentu
 */
function setEventBody()
{
    document.body.onclick = function(event) {
        
        let newTarget = event.target;
        let index = elemIndexBody(newTarget);
        
        setColor(allLi[index]);
    };
}

/*
 * Eventy na ktere ma reagovat prvek inspektoru
 */
function setEventInspektor(divPanel)
{
    divPanel.onclick = function(event) {
        
        let newTarget = event.target;
        let index = elemIndexInspektor(newTarget);
        
        setColor(all[index]);
        
        event.stopPropagation(); // DOTO vyrest o jinak, tohle neni moc dobre reseni
    };
    
}

/*
 * Eventy pro pomocne okno pro zadavani a odebirati atributu
 */
function setEventDialog()
{
    divPanel.ondblclick = function(event) {
        if (event.target === divPanel || event.target.tagName.toLowerCase() === 'ul')
            divModal.style.display = "none";
        else
        {
           let newTarget = event.target;
           let index = elemIndexInspektor(newTarget);
           
           if (all[index].nodeType === Node.TEXT_NODE)
               return;
           
           changingNode = all[index];
           let className = all[index].className;
           let id = all[index].id;
           
            h4Modal.textContent = "Editace atributu class a id pro prvek: " + all[index].tagName;
            classModal.value = className;
            idModal.value = id;
            
           
           divModal.style.display = "block";
           
           event.stopPropagation();
           
        }
    };
    
    spanClose.onclick = function() {
        divModal.style.display = "none";
    };
    
    window.onclick = function(event) {
        if (event.target === divModal)
            divModal.style.display = "none";
    };
    
    form.onsubmit = function(event) {
        let className = classModal.value;
        let id = idModal.value;
        
        changingNode.className = className;
        changingNode.id = id;
        
        divModal.style.display = "none"; 
        
        event.preventDefault();
    };
    
}

/*
 * Funkce prochazi polem elementu z html stranky a hleda dany uzel - najde prvni vyskyt
 * @param node, uzel ktery se hleda
 * @returns Index jaky dany uzel ma v poli elementu
 */
function elemIndexBody(node)
{
    for (let i = 0; i < all.length; i++)
    {
        if (all[i] === node)
            return i;
    }
}

/*
 * Funkce prochazi polem elementu z inspektoru a hleda dany uzel - najde prvni vyskyt
 * @param node, uzel ktery se hleda
 * @returns Index jaky dany uzel ma v poli elementu
 */
function elemIndexInspektor(node)
{
    for (let i = 0; i < allLi.length; i++)
    {
        if (allLi[i] === node)
            return i;
    }
}

/*
 * @param target element pro ktery se nastavuje barva
 */
function setColor(newTarget)
{
    if (newTarget.nodeType === Node.TEXT_NODE) //textove retezce nebarvit, jinac to vyvola chybu a barveni se zasekne - OZNACIT PARENT
    {
        let parent = newTarget.parentElement;
        if (parent !== null)
            newTarget = parent;
    }
    
    if(oldTarget) //nekdo uz je obarveny, odbarvime ho
        oldTarget.classList.remove('coloring');
    
    oldTarget = newTarget;
    oldTarget.classList.add('coloring');
}

/*
 * Funkce vytvori element inspektoru 
 */
function createInspektorElem()
{
    divPanel = document.createElement('div');
    divPanel.classList.add("inspektor");
    
    createList(divPanel);
    setEventInspektor(divPanel);
    
    document.body.appendChild(divPanel);
    
}
/*
 * Funkce vytvori zaklad DOM Stromu inspektoru (HTML, HEAD, BODY), dale vola
 * funkci, ktera rekurzivne prochazi prvkem BODY a hleda dalsi komponeny.
 * 
 * @param divPanel Div panel do ktereho se tvori inspektor
 */
function createList(divPanel)
{
    let ulMain = document.createElement('ul');
    
    let liHTML = document.createElement('li');
    liHTML.textContent = "HTML";
    ulMain.appendChild(liHTML);
    all.push(document.documentElement); //HTML
    allLi.push(liHTML);
    
    let inner = document.createElement('ul');
    
    let liHEAD = document.createElement('li');
    liHEAD.textContent = "HEAD";
    inner.appendChild(liHEAD);
    all.push(document.head); //HEAD
    allLi.push(liHEAD);
    
    let liBODY = document.createElement('li');
    liBODY.textContent = "BODY";
    inner.appendChild(liBODY);
    all.push(document.body); //BODY
    allLi.push(liBODY);
    
    findNodes(document.body, inner); 
    
    ulMain.appendChild(inner);
    divPanel.appendChild(ulMain); 
}

/*
 * Test zda textovy uzel obsahuje jenom bile znaky
 * https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace_in_the_DOM
 * @param  node Uzel jehoz obsah se testuje
 * @returns true pokud text obsahuje jenom bile znaky, jinac false
 */
function isEmpty(node)
{
    return !(/[^\t\n\r ]/.test(node.textContent)); //najdi jakykoliv znak, ktery neni mezi [], a testuje to s danym retezcem
}



/*
 * Rekurzivni funkce, vzdy pro daneho rodice prochazi jeho deti a tiskne je.
 * @param  body Dany rodicovsky uzel od ktereho hledame
 * @param  parent Uzel, ke kteremu pripojujeme vysledek
 */
function findNodes(body, parent)
{
    let newUl = document.createElement('ul');
    
    //maji se zpracovavat Dokumentove, Elementove a Textove uzly, pokud je ale dokument formatovany,
    //tak za textove uzly jsou povaovany i ty formatovaci prazdne radky, mezery, tabulatory....
    // ty se asi jako textove uzly tisknou nemaji a tak je budeme ignorovat... ASI
    for (let node of body.childNodes)
    {
        if (node.nodeType === Node.TEXT_NODE) 
        {
            if (isEmpty(node)) //je to prazdne, netiskneme
                continue;
            else 
            {
                let newLi = document.createElement('li');
                newLi.textContent = "Text";
                newLi.title = node.textContent;
                newUl.appendChild(newLi);
                all.push(node);
                allLi.push(newLi);
                
                findNodes(node, newLi);
            }
        }
        else if (node.nodeType === Node.ELEMENT_NODE)
        {
            if (node.tagName.toLowerCase() === 'script') //SCRIPT tag asi ignorovat
                continue;
            
            let newLi = document.createElement('li');
            newLi.textContent = node.tagName;
            newUl.appendChild(newLi);
            all.push(node);
            allLi.push(newLi);
            
            findNodes(node, newUl);
        }
        else
            alert("IDK");
        
        
    }
    
    parent.appendChild(newUl);
}

/*
 * Funkce vytvori docasne okno, ve kterem bude uzivatel moct pridat/odstarnit atributy
 * class a id pro dany element
 * https://www.w3schools.com/howto/howto_css_modals.asp
 * @param  node uzel kteremu se bude neco moct menit
 */
function modalWindow()
{
    divModal = document.createElement('div');
    divModal.classList.add("modalInspektor");
    
    let divContent = document.createElement('div');
    divContent.classList.add("modalContentInspektor");
    
    spanClose = document.createElement('span');
    spanClose.classList.add("modalCloseInspektor");
    spanClose.innerHTML = "&times;";
    divContent.appendChild(spanClose);
    
    h4Modal = document.createElement('h4');
    h4Modal.textContent = "Editace atributu class a id pro prvek: ";
    divContent.appendChild(h4Modal);
    

    form = document.createElement('form');
    
    // pro class
    classModal = document.createElement("input"); //input element, text
    classModal.setAttribute('type',"text");
    classModal.setAttribute('name',"class");
    
    //pro id
    idModal = document.createElement("input"); //input element, text
    idModal.setAttribute('type',"text");
    idModal.setAttribute('name',"id");

    let s = document.createElement("input"); //input element, Submit button
    s.setAttribute('type',"submit");
    s.setAttribute('value',"Submit");
    
    form.appendChild(document.createTextNode('Class:'));
    form.appendChild(document.createElement("BR"));
    form.appendChild(classModal);
    form.appendChild(document.createElement("BR"));
    form.appendChild(document.createTextNode('ID:'));
    form.appendChild(document.createElement("BR"));
    form.appendChild(idModal);
    form.appendChild(document.createElement("BR"));
    form.appendChild(s);
    
    divContent.appendChild(form);
    
    divModal.appendChild(divContent);
    
    document.body.appendChild(divModal);
    
    
    
}