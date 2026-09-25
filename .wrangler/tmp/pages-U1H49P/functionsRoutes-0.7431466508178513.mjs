import { onRequestGet as __api_mercadopago_check_payment_js_onRequestGet } from "/root/ClubeMkt/mimenu/functions/api/mercadopago/check-payment.js"
import { onRequestPost as __api_mercadopago_create_card_payment_ts_onRequestPost } from "/root/ClubeMkt/mimenu/functions/api/mercadopago/create-card-payment.ts"
import { onRequestPost as __api_mercadopago_create_payment_ts_onRequestPost } from "/root/ClubeMkt/mimenu/functions/api/mercadopago/create-payment.ts"
import { onRequestPost as __api_mercadopago_webhook_ts_onRequestPost } from "/root/ClubeMkt/mimenu/functions/api/mercadopago/webhook.ts"
import { onRequestPost as __api_orders_add_items_ts_onRequestPost } from "/root/ClubeMkt/mimenu/functions/api/orders/add-items.ts"
import { onRequestPost as __api_orders_generate_pix_ts_onRequestPost } from "/root/ClubeMkt/mimenu/functions/api/orders/generate-pix.ts"
import { onRequest as __api_waiters_create_waiter_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/waiters/create-waiter.js"
import { onRequest as __api_waiters_delete_waiter_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/waiters/delete-waiter.js"
import { onRequest as __api_waiters_list_waiters_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/waiters/list-waiters.js"
import { onRequest as __api_waiters_send_password_reset_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/waiters/send-password-reset.js"
import { onRequest as __api_waiters_update_waiter_profile_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/waiters/update-waiter-profile.js"
import { onRequest as __api_whatsapp_connection_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/whatsapp/connection.js"
import { onRequest as __api_whatsapp_qr_code_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/whatsapp/qr-code.js"
import { onRequest as __api_whatsapp_send_message_ts_onRequest } from "/root/ClubeMkt/mimenu/functions/api/whatsapp/send-message.ts"
import { onRequest as __api_whatsapp_status_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/whatsapp/status.js"
import { onRequest as __api_whatsapp_test_evolution_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/whatsapp/test-evolution.js"
import { onRequest as __api_whatsapp_test_message_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/whatsapp/test-message.js"
import { onRequest as __api_whatsapp_webhook_ts_onRequest } from "/root/ClubeMkt/mimenu/functions/api/whatsapp/webhook.ts"
import { onRequest as __api_health_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/health.js"
import { onRequest as __api_test_js_onRequest } from "/root/ClubeMkt/mimenu/functions/api/test.js"
import { onRequest as ___middleware_js_onRequest } from "/root/ClubeMkt/mimenu/functions/_middleware.js"

export const routes = [
    {
      routePath: "/api/mercadopago/check-payment",
      mountPath: "/api/mercadopago",
      method: "GET",
      middlewares: [],
      modules: [__api_mercadopago_check_payment_js_onRequestGet],
    },
  {
      routePath: "/api/mercadopago/create-card-payment",
      mountPath: "/api/mercadopago",
      method: "POST",
      middlewares: [],
      modules: [__api_mercadopago_create_card_payment_ts_onRequestPost],
    },
  {
      routePath: "/api/mercadopago/create-payment",
      mountPath: "/api/mercadopago",
      method: "POST",
      middlewares: [],
      modules: [__api_mercadopago_create_payment_ts_onRequestPost],
    },
  {
      routePath: "/api/mercadopago/webhook",
      mountPath: "/api/mercadopago",
      method: "POST",
      middlewares: [],
      modules: [__api_mercadopago_webhook_ts_onRequestPost],
    },
  {
      routePath: "/api/orders/add-items",
      mountPath: "/api/orders",
      method: "POST",
      middlewares: [],
      modules: [__api_orders_add_items_ts_onRequestPost],
    },
  {
      routePath: "/api/orders/generate-pix",
      mountPath: "/api/orders",
      method: "POST",
      middlewares: [],
      modules: [__api_orders_generate_pix_ts_onRequestPost],
    },
  {
      routePath: "/api/waiters/create-waiter",
      mountPath: "/api/waiters",
      method: "",
      middlewares: [],
      modules: [__api_waiters_create_waiter_js_onRequest],
    },
  {
      routePath: "/api/waiters/delete-waiter",
      mountPath: "/api/waiters",
      method: "",
      middlewares: [],
      modules: [__api_waiters_delete_waiter_js_onRequest],
    },
  {
      routePath: "/api/waiters/list-waiters",
      mountPath: "/api/waiters",
      method: "",
      middlewares: [],
      modules: [__api_waiters_list_waiters_js_onRequest],
    },
  {
      routePath: "/api/waiters/send-password-reset",
      mountPath: "/api/waiters",
      method: "",
      middlewares: [],
      modules: [__api_waiters_send_password_reset_js_onRequest],
    },
  {
      routePath: "/api/waiters/update-waiter-profile",
      mountPath: "/api/waiters",
      method: "",
      middlewares: [],
      modules: [__api_waiters_update_waiter_profile_js_onRequest],
    },
  {
      routePath: "/api/whatsapp/connection",
      mountPath: "/api/whatsapp",
      method: "",
      middlewares: [],
      modules: [__api_whatsapp_connection_js_onRequest],
    },
  {
      routePath: "/api/whatsapp/qr-code",
      mountPath: "/api/whatsapp",
      method: "",
      middlewares: [],
      modules: [__api_whatsapp_qr_code_js_onRequest],
    },
  {
      routePath: "/api/whatsapp/send-message",
      mountPath: "/api/whatsapp",
      method: "",
      middlewares: [],
      modules: [__api_whatsapp_send_message_ts_onRequest],
    },
  {
      routePath: "/api/whatsapp/status",
      mountPath: "/api/whatsapp",
      method: "",
      middlewares: [],
      modules: [__api_whatsapp_status_js_onRequest],
    },
  {
      routePath: "/api/whatsapp/test-evolution",
      mountPath: "/api/whatsapp",
      method: "",
      middlewares: [],
      modules: [__api_whatsapp_test_evolution_js_onRequest],
    },
  {
      routePath: "/api/whatsapp/test-message",
      mountPath: "/api/whatsapp",
      method: "",
      middlewares: [],
      modules: [__api_whatsapp_test_message_js_onRequest],
    },
  {
      routePath: "/api/whatsapp/webhook",
      mountPath: "/api/whatsapp",
      method: "",
      middlewares: [],
      modules: [__api_whatsapp_webhook_ts_onRequest],
    },
  {
      routePath: "/api/health",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_health_js_onRequest],
    },
  {
      routePath: "/api/test",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_test_js_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]