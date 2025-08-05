# Configuração do provedor AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configuração da AWS
provider "aws" {
  region = "us-east-1"
} 