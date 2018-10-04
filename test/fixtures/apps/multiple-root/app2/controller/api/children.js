'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller
 */
class ChildrenController extends Controller {
  /**
   * @Summary 获取子资源
   * @Router GET /api/children
   * @Response 200 baseResponse
   */
  async index() {
    this.ctx.body = {
      result: true,
    };
  }

  /**
   * @Summary 创建子资源
   * @Router POST /api/children
   * @Request body createResource *body resourceInfo
   * @Response 200 baseResponse
   */
  async create() {
    this.ctx.body = {
      result: true,
    };
  }
}

module.exports = ChildrenController;
