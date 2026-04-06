using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReHUD.Migrations
{
    /// <inheritdoc />
    public partial class AddVirtualEnergyUsages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VirtualEnergyUsages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DataId = table.Column<int>(type: "INTEGER", nullable: true),
                    PendingRemoval = table.Column<bool>(type: "INTEGER", nullable: false),
                    Value = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VirtualEnergyUsages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VirtualEnergyUsages_LapDatas_DataId",
                        column: x => x.DataId,
                        principalTable: "LapDatas",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_VirtualEnergyUsages_DataId",
                table: "VirtualEnergyUsages",
                column: "DataId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VirtualEnergyUsages");
        }
    }
}
