import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  urlCategory = new URL('api/rest/categories', BACKEND_URL);
  urlProduct = new URL('api/rest/products', BACKEND_URL);
  categories;
  productInfo;

  constructor (productId) {
    this.productId = productId;
  }

  async loadData(id) {
    this.urlCategory.searchParams.set('_sort', 'weight');
    this.urlCategory.searchParams.set('_refs', 'subcategory');
    const promiseCategory = fetchJson(this.urlCategory);

    if (id) {
      this.urlProduct.searchParams.set('id', id);
      const promiseProduct = fetchJson(this.urlProduct);
      return await Promise.all([promiseCategory, promiseProduct]);
    } else {
      return promiseCategory.then(response => response);
    }
  }

  async render () {
    const element = document.createElement("div");
    element.classList.add('product-form');
    this.element = element;

  //   this.renderForm();
  // }

  // async renderForm() {
    const data = await this.loadData(this.productId);
    if (data) {
      this.categories = this.productId ? data[0] : data;
      this.productInfo = this.productId ? data[1][0] : '';

      const container = document.createElement("div");
      container.innerHTML = this.getTemplate();
      this.element.append(container.firstElementChild);

      this.subElements = this.getSubElements(this.element);
    }
  }

  getCategoties() {
    return this.categories.map(item => {
      return item.subcategories.map(subitem => {
        return `<option value="${subitem.id}" ${this.productInfo && subitem.id === this.productInfo.subcategory && `selected`}>
          ${item.title} ${escapeHtml('>')} ${subitem.title}
          </option>`
      }).join('');
    }).join('');
  }

  getTemplate() {
    return `
      <form data-element="productForm" class="form-grid">
        <div class="form-group form-group__half_left">
          <fieldset>
            <label class="form-label">Название товара</label>
            <input required="" type="text" name="title" class="form-control" placeholder="Название товара"
                value="${this.productInfo && escapeHtml(this.productInfo.title)}">
          </fieldset>
        </div>
        <div class="form-group form-group__wide">
          <label class="form-label">Описание</label>
          <textarea required="" class="form-control" name="description" data-element="productDescription"
            placeholder="Описание товара" >${this.productInfo && escapeHtml(this.productInfo.description)}</textarea>
        </div>
        <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          <div data-element="imageListContainer"><ul class="sortable-list"><li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
            <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
            <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="https://i.imgur.com/MWorX2R.jpg">
          <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
        </span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle="" alt="delete">
            </button></li></ul></div>
          <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
        </div>
        <div class="form-group form-group__half_left">
          <label class="form-label">Категория</label>
          <select class="form-control" name="subcategory">
            ${this.getCategoties()}
          </select>
        </div>
        <div class="form-group form-group__half_left form-group__two-col">
          <fieldset>
            <label class="form-label">Цена ($)</label>
            <input required="" type="number" name="price" class="form-control" placeholder="100"
              value="${this.productInfo && this.productInfo.price}">
          </fieldset>
          <fieldset>
            <label class="form-label">Скидка ($)</label>
            <input required="" type="number" name="discount" class="form-control" placeholder="0"
            value="${this.productInfo && this.productInfo.discount}">
          </fieldset>
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Количество</label>
          <input required="" type="number" class="form-control" name="quantity" placeholder="1"
          value="${this.productInfo && this.productInfo.quantity}">
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Статус</label>
          <select class="form-control" name="status">
            <option value="1" ${this.productInfo && this.productInfo.status && `selected`}>Активен</option>
            <option value="0" ${this.productInfo && !this.productInfo.status && `selected`}>Неактивен</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit" name="save" class="button-primary-outline">
            Сохранить товар
          </button>
        </div>
      </form>
    `
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
