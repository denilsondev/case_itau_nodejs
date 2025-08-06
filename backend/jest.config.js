module.exports = {
  // Preset para TypeScript
  preset: 'ts-jest',
  
  // Ambiente de teste
  testEnvironment: 'node',
  
  // Diretórios onde procurar testes
  roots: ['<rootDir>/src'],
  
  // Padrão dos arquivos de teste
  testMatch: ['**/*.spec.ts'],
  
  // Arquivos para incluir na cobertura
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.interface.ts',
    '!src/main.ts',
  ],
  
  // Configurações de cobertura
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Configurações do TypeScript
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
  // Módulos para mapear
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
}; 