import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgrid from '@sendgrid/mail';
import * as nodemailer from 'nodemailer';

// ==================== INTERFACES ====================
export interface MailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

// ==================== PROVIDERS ====================
class SendGridProvider implements MailProvider {
  private readonly logger = new Logger(SendGridProvider.name);
  
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY no está configurada en las variables de entorno');
    }
    sendgrid.setApiKey(apiKey);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const from = this.configService.get<string>('MAIL_FROM', 'notificaciones@laboratorio.com');
      
      const msg = {
        to,
        from,
        subject,
        html,
        trackingSettings: {
          clickTracking: { enable: false },
          openTracking: { enable: false },
        },
      };

      await sendgrid.send(msg);
      this.logger.debug(`Email enviado con SendGrid a: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando email con SendGrid a ${to}:`, error.message);
      return false;
    }
  }
}

class SMTPProvider implements MailProvider {
  private readonly logger = new Logger(SMTPProvider.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const mailConfig = {
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
      // Configuraciones adicionales para mejor rendimiento
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    };

    this.transporter = nodemailer.createTransport(mailConfig);

    // Verificar conexión al iniciar
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión SMTP verificada correctamente');
    } catch (error) {
      this.logger.warn('No se pudo verificar la conexión SMTP:', error.message);
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const from = this.configService.get<string>('MAIL_FROM', 'noreply@laboratorio.com');
      
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Sistema de Laboratorio" <${from}>`,
        to,
        subject,
        html,
        // Optimización para deliverability
        headers: {
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'Normal',
        },
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email enviado con SMTP a ${to}, MessageID: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando email con SMTP a ${to}:`, error.message);
      return false;
    }
  }
}

class LogProvider implements MailProvider {
  private readonly logger = new Logger(LogProvider.name);

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    this.logger.log(` [EMAIL SIMULADO] Para: ${to}`);
    this.logger.log(` [EMAIL SIMULADO] Asunto: ${subject}`);
    
    // Extraer texto del HTML para mejor visualización
    const textContent = html.replace(/<[^>]*>/g, '').substring(0, 300);
    this.logger.log(` [EMAIL SIMULADO] Contenido: ${textContent}...`);
    
    return true;
  }
}

// ==================== MAIN SERVICE ====================
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private provider: MailProvider;

  constructor(private configService: ConfigService) {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    const providerType = this.configService.get<string>('MAIL_PROVIDER', 'log').toLowerCase();
    
    try {
      switch (providerType) {
        case 'sendgrid':
          this.provider = new SendGridProvider(this.configService);
          this.logger.log(' Usando SendGrid como proveedor de email');
          break;
          
        case 'smtp':
          this.provider = new SMTPProvider(this.configService);
          this.logger.log(' Usando SMTP como proveedor de email');
          break;
          
        case 'log':
        default:
          this.provider = new LogProvider();
          this.logger.log(' Usando LogProvider (solo para desarrollo)');
          break;
      }
    } catch (error) {
      this.logger.error(`Error inicializando proveedor ${providerType}:`, error.message);
      this.logger.warn('Falling back to LogProvider');
      this.provider = new LogProvider();
    }
  }

  // ==================== MÉTODOS PÚBLICOS ====================
  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      // Validación básica
      if (!this.isValidEmail(to)) {
        this.logger.warn(`Email inválido: ${to}`);
        return false;
      }

      return await this.provider.sendEmail(to, subject, html);
    } catch (error) {
      this.logger.error(`Error en sendEmail para ${to}:`, error.message);
      return false;
    }
  }

  // ==================== MÉTODOS ESPECÍFICOS ====================
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const template = this.generatePasswordResetTemplate(resetLink);
    return this.sendEmail(email, template.subject, template.html);
  }

  async sendPasswordChangedConfirmation(email: string): Promise<boolean> {
    const template = this.generatePasswordChangedTemplate();
    return this.sendEmail(email, template.subject, template.html);
  }

  async sendEmailChangeConfirmation(newEmail: string, confirmationLink: string): Promise<boolean> {
    const template = this.generateEmailChangeTemplate(confirmationLink);
    return this.sendEmail(newEmail, template.subject, template.html);
  }

  async sendWelcomeEmail(email: string, name: string, temporaryPassword?: string): Promise<boolean> {
    const loginUrl = this.configService.get<string>('FRONTEND_LOGIN_URL', 'http://localhost:4200/login');
    const template = this.generateWelcomeTemplate(name, loginUrl, temporaryPassword);
    return this.sendEmail(email, template.subject, template.html);
  }

  async sendNotificationEmail(email: string, title: string, message: string, actionUrl?: string): Promise<boolean> {
    const template = this.generateNotificationTemplate(title, message, actionUrl);
    return this.sendEmail(email, template.subject, template.html);
  }

  // ==================== PLANTILLAS HTML ====================
  private generatePasswordResetTemplate(resetLink: string): EmailTemplate {
    const subject = ' Restablecimiento de Contraseña - Sistema de Laboratorio';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .link { word-break: break-all; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Sistema de Laboratorio Vial</h1>
            <p>Restablecimiento de Contraseña</p>
          </div>
          <div class="content">
            <h2>Hola,</h2>
            <p>Has solicitado restablecer tu contraseña en el Sistema de Laboratorio.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="button">Restablecer Contraseña</a>
            </div>
            
            <div class="warning">
              <p><strong> Este enlace expirará en 1 hora</strong></p>
              <p>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
              <p class="link">${resetLink}</p>
            </div>
            
            <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            
            <p>Para cualquier consulta, contacta al administrador del sistema.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sistema de Laboratorio Vial. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }

  private generatePasswordChangedTemplate(): EmailTemplate {
    const subject = ' Contraseña Actualizada - Sistema de Laboratorio';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .success-box { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Sistema de Laboratorio Vial</h1>
            <p>Contraseña Actualizada</p>
          </div>
          <div class="content">
            <h2>Hola,</h2>
            
            <div class="success-box">
              <h3> Tu contraseña ha sido actualizada exitosamente</h3>
            </div>
            
            <p><strong>Fecha y hora del cambio:</strong> ${new Date().toLocaleString('es-ES')}</p>
            
            <p>Si <strong>NO</strong> realizaste este cambio, contacta inmediatamente al administrador del sistema.</p>
            
            <h3> Recomendaciones de seguridad:</h3>
            <ul>
              <li>Usa contraseñas únicas y complejas</li>
              <li>Cambia tu contraseña regularmente</li>
              <li>No compartas tus credenciales con nadie</li>
              <li>Habilita la autenticación de dos factores si está disponible</li>
            </ul>
            
            <p>Para mayor seguridad, revisa regularmente la actividad de tu cuenta.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sistema de Laboratorio Vial. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }

  private generateEmailChangeTemplate(confirmationLink: string): EmailTemplate {
    const subject = ' Confirmación de Cambio de Email - Sistema de Laboratorio';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background: linear-gradient(135deg, #FF9800 0%, #FF5722 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #FF9800 0%, #FF5722 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Sistema de Laboratorio Vial</h1>
            <p>Confirmación de Cambio de Email</p>
          </div>
          <div class="content">
            <h2>Hola,</h2>
            <p>Has solicitado cambiar tu dirección de email en el Sistema de Laboratorio.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationLink}" class="button">Confirmar Cambio de Email</a>
            </div>
            
            <p>Este enlace expirará en 1 hora.</p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong> Importante:</strong></p>
              <p>Si confirmas este cambio, tu dirección de email actual será reemplazada y deberás usar la nueva dirección para iniciar sesión.</p>
            </div>
            
            <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sistema de Laboratorio Vial. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }

  private generateWelcomeTemplate(name: string, loginUrl: string, temporaryPassword?: string): EmailTemplate {
    const subject = ' ¡Bienvenido al Sistema de Laboratorio Vial!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .credentials { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; border-radius: 5px; font-family: 'Courier New', monospace; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Sistema de Laboratorio Vial</h1>
            <p>¡Bienvenido, ${name}!</p>
          </div>
          <div class="content">
            <h2>Hola ${name},</h2>
            <p>Tu cuenta ha sido creada exitosamente en el Sistema de Gestión de Laboratorio Vial.</p>
            
            ${temporaryPassword ? `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3> Credenciales de Acceso:</h3>
              <div class="credentials">
                <p><strong>Contraseña Temporal:</strong> ${temporaryPassword}</p>
              </div>
              <p><strong> IMPORTANTE:</strong> Debes cambiar esta contraseña después de tu primer inicio de sesión.</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" class="button"> Iniciar Sesión</a>
            </div>
            
            <h3> Lo que podrás hacer en el sistema:</h3>
            <ul>
              <li> Gestionar solicitudes de pruebas de laboratorio</li>
              <li> Ver resultados y reportes detallados</li>
              <li> Comunicarte con otros miembros del equipo</li>
              <li> Configurar tus preferencias y notificaciones</li>
              <li> Monitorear el progreso de los proyectos</li>
            </ul>
            
            <p>Para comenzar, accede al sistema usando las credenciales proporcionadas.</p>
            
            <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactar al administrador del sistema.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sistema de Laboratorio Vial. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }

  private generateNotificationTemplate(title: string, message: string, actionUrl?: string): EmailTemplate {
    const subject = ` ${title} - Sistema de Laboratorio`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background: linear-gradient(135deg, #9C27B0 0%, #673AB7 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .notification { background-color: #e7f5ff; border-left: 4px solid #2196F3; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #9C27B0 0%, #673AB7 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Sistema de Laboratorio Vial</h1>
            <p>Nueva Notificación</p>
          </div>
          <div class="content">
            <h2>${title}</h2>
            
            <div class="notification">
              <p>${message}</p>
            </div>
            
            ${actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}" class="button">Ver Detalles</a>
            </div>
            ` : ''}
            
            <p><strong> Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            
            <p>Para gestionar tus notificaciones, accede a la configuración de tu perfil en el sistema.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sistema de Laboratorio Vial. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }

  // ==================== UTILIDADES ====================
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Método para obtener estadísticas de uso (opcional para monitoreo)
   */
  getProviderType(): string {
    return this.provider.constructor.name;
  }
}