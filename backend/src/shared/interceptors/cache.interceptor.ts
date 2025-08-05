import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    
    // Adicionar headers de cache para respostas de sucesso
    response.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutos
    response.setHeader('ETag', `"${Date.now()}"`);
    
    return next.handle().pipe(
      map(data => {
        // Adicionar informação sobre cache na resposta
        if (data && typeof data === 'object') {
          return {
            ...data,
            _cache: {
              timestamp: new Date().toISOString(),
              ttl: 300 // 5 minutos em segundos
            }
          };
        }
        return data;
      })
    );
  }
} 