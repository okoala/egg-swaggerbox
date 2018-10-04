'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller
 */
class ResourceController extends Controller {
  /**
   * @Summary 创建资源
   * @Router GET /resource
   * @Response 200 baseResponse
   */
  async index() {
    this.ctx.body = {
      result: true,
    };
  }

  /**
   * @Summary 创建资源
   * @Router POST /resource
   * @Request body createResource *body 资源信息
   * @Response 200 baseResponse
   */
  async create() {
    this.ctx.body = {
      result: true,
    };
  }
}

module.exports = ResourceController;
