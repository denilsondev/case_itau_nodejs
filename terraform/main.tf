# ========================================
# TERRAFORM ULTRA SIMPLES - TUDO NA EC2
# ========================================

# ========================================
# EC2 (TUDO EM UMA INSTÂNCIA)
# ========================================

resource "aws_instance" "app" {
  ami           = "ami-021589336d307b577" # Ubuntu 22.04 LTS (Canonical)
  instance_type = "t3.small"

  key_name = "case-itau-key"

  # Abrir todas as portas necessárias
  vpc_security_group_ids = [aws_security_group.app.id]

  # Script simples de inicialização
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y docker.io docker-compose
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu
              
              mkdir -p /home/ubuntu/case-itau
              chown ubuntu:ubuntu /home/ubuntu/case-itau
              cd /home/ubuntu/case-itau
              
              echo "✅ EC2 configurada!"
              echo "📋 Próximos passos:"
              echo "   1. Copie os arquivos: scp -r case_itau_nodejs case_itau_angular docker-compose.yml ubuntu@IP:/home/ubuntu/case-itau/"
              echo "   2. Acesse: ssh -i case-itau-key.pem ubuntu@IP"
              echo "   3. Execute: cd /home/ubuntu/case-itau && docker-compose up -d"
              EOF

  tags = {
    Name = "case-itau-app"
  }
}

# ========================================
# SECURITY GROUP (SIMPLES)
# ========================================

resource "aws_security_group" "app" {
  name        = "case-itau-sg"
  description = "Security group for Case Itau"

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend Angular
  ingress {
    from_port   = 4200
    to_port     = 4200
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # MySQL (opcional, só se quiser acessar de fora)
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Saída
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "case-itau-sg"
  }
} 