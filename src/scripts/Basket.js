const container = document.querySelector("container")

function defaultBasketDiv(params) {
  const basketDiv = document.createElement('div')
  basketDiv.className = "basket_div"

  const basketDivForImg = document.createElement('div')
  basketDivForImg.className = "basket_div_for_img"

  const img = document.createElement('img')
  img.src = "/images/basket_img.png"
  img.alt = "Пустая корзина"
  basketDivForImg.append(img)

  const basket_h1 = document.createElement("h1")
  basket_h1.className = "basket_h1"
  basket_h1.textContent = "В корзине пока нет товаров"

  const basket_p = document.createElement("p")
  basket_p.className = "basket_p"
  basket_p.textContent = "Начните с подборок на главной странице или найдите нужный товар через поиск"

  basketDiv.append(basketDivForImg, basket_h1, basket_p)
  return basketDiv
}

function addBasketProducts(params) {
  const basketProductsSection = document.createElement("div")
  basketProductsSection.className = "basket_products_section"
 
  const basketProduct_h1 = document.createElement('h1')
  basketProduct_h1.className = "basket_products_h1"
  basketProduct_h1.textContent = "Корзина товаров"

  // const basket
}