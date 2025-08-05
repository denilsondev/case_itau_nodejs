# ========================================
# OUTPUTS - INFORMAÇÕES ESSENCIAIS
# ========================================

output "ec2_public_ip" {
  description = "IP público da EC2"
  value       = aws_instance.app.public_ip
}

output "deploy_instructions" {
  description = "Como fazer deploy"
  value = <<EOF

🚀 DEPLOY ULTRA SIMPLES - TUDO NA EC2:

1. CRIAR KEY PAIR:
   aws ec2 create-key-pair --key-name case-itau-key --query 'KeyMaterial' --output text > case-itau-key.pem
   chmod 400 case-itau-key.pem

2. APLICAR TERRAFORM:
   terraform init
   terraform apply

3. COPIAR CÓDIGO:
   scp -r case_itau_nodejs ubuntu@${aws_instance.app.public_ip}:/home/ubuntu/case-itau/
   scp -r case_itau_angular ubuntu@${aws_instance.app.public_ip}:/home/ubuntu/case-itau/
   scp docker-compose.yml ubuntu@${aws_instance.app.public_ip}:/home/ubuntu/case-itau/

4. FAZER DEPLOY:
   ssh -i case-itau-key.pem ubuntu@${aws_instance.app.public_ip}
   cd /home/ubuntu/case-itau
   docker-compose up -d

5. ACESSAR:
   - Frontend: http://${aws_instance.app.public_ip}:4200
   - Backend: http://${aws_instance.app.public_ip}:8080/api
   - Swagger: http://${aws_instance.app.public_ip}:8080/docs
   - MySQL: ${aws_instance.app.public_ip}:3306 (se necessário)

6. LIMPAR:
   terraform destroy

💡 VANTAGENS:
   - Mais simples (só 1 serviço AWS)
   - Mais barato (~$15-20/mês)
   - Mesmo docker-compose do desenvolvimento
   - Fácil de debugar

EOF
} 