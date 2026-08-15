import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { getShopifyAppConfig, verifyOAuthState } from './shopify-oauth';
import { ShopifyImportService } from './shopify-import.service';

@Controller('integrations/shopify')
export class ShopifyOAuthController {
  constructor(private readonly shopify: ShopifyImportService) {}

  @Get('callback')
  async callback(
    @Query('code') code: string | undefined,
    @Query('shop') shop: string | undefined,
    @Query('state') state: string | undefined,
    @Res() res: Response
  ) {
    const { backofficeUrl } = getShopifyAppConfig();
    try {
      if (!code || !shop || !state) {
        throw new Error('Missing Shopify OAuth callback parameters');
      }
      const result = await this.shopify.completeOAuth({ code, shop, state });
      return res.redirect(result.redirectTo);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Shopify OAuth failed';
      let projectPath = '/projects';
      if (state) {
        try {
          const parsed = verifyOAuthState(state);
          projectPath = `/${parsed.projectId}/integrations/shopify`;
        } catch {
          /* keep fallback */
        }
      }
      return res.redirect(
        `${backofficeUrl}${projectPath}?shopify_error=${encodeURIComponent(message)}`
      );
    }
  }
}
