import v8 from 'node:v8'

if (v8.startupSnapshot) {
  v8.startupSnapshot.isBuildingSnapshot = () => false
}