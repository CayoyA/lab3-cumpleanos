<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

---

# Laboratorio 3: Despliegue Automatizado en Kubernetes con Jenkins

Este proyecto implementa un pipeline de Integración y Despliegue Continuo (CI/CD) utilizando **Jenkins**, **Docker Hub** y un clúster local de **Kubernetes** (vía Docker Desktop) para empaquetar y desplegar una aplicación NestJS sobre un entorno Linux Ubuntu.

**Estudiante:** Carmen Gloria Muñoz  
**Repositorio Docker Hub:** [cayoya/tarea-final](https://hub.docker.com/r/cayoya/tarea-final)  
**Ambiente de Despliegue:** `produccion-local`  
**Pipeline Ejecutado:** `Jenkinsfile.CGloria-Munoz` _(Vía WebSockets)_

---

## Arquitectura de la Automatización

El flujo configurado en Jenkins ejecuta de forma automática los siguientes pasos dentro de agentes dinámicos en Kubernetes (`agent.yaml`):

1. **Declarative: Checkout SCM:** Clonación limpia del código fuente desde GitHub.
2. **Install & Test:** Preparación del entorno con `pnpm install` y ejecución de las pruebas unitarias del framework.
3. **Build Image:** Construcción de la imagen Docker optimizada mediante filtros en el archivo `.dockerignore`.
4. **Push Image:** Publicación de la imagen en Docker Hub con la etiqueta correspondiente.
5. **Deploy K8s:** Despliegue automatizado aplicando los manifiestos unificados dentro del clúster local.

---

## Instrucciones de Validación (Para el Evaluador)

Para comprobar que el pipeline cumplió su objetivo y que la aplicación NestJS está corriendo de forma óptima en el clúster, ejecute los siguientes comandos en su terminal paso a paso:

### 1. Verificar el estado de los Pods y Réplicas
Confirme que se crearon y están activas las 2 réplicas solicitadas dentro del Namespace exclusivo del proyecto:

kubectl get pods -n ns-cgloria-munoz


## 2. Validar ConfigMaps y Secrets (Inyección de Variables)
Para confirmar que el Secret (codificado en Base64) y el ConfigMap inyectaron correctamente las credenciales en el contenedor NestJS:

kubectl exec deployment/app-cgloria-munoz -n ns-cgloria-munoz -- printenv | grep -E "AMBIENTE|API_KEY"


## 3. Prueba de Acceso a la Aplicación (Port-Forward)
Realice un mapeo de puertos hacia el Service de Kubernetes para probar el endpoint de la aplicación en caliente:
￼
kubectl port-forward svc/svc-cgloria-munoz 8888:80 -n ns-cgloria-munoz

## 4. Abra otra pestaña de la terminal o su navegador y realice la petición de prueba con curl:
curl http://localhost:8888/lab

Respuesta exitosa esperada: Hola profesor! Servidor operativo. Ambiente K8s: produccion-local | API_KEY: mi-clave-secreta-2026 | Despliegue exitoso por Carmen Gloria Muñoz
